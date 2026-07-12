# Payroll Module Implementation Guide

## Quick Start

Follow this guide to implement the production-ready payroll module step-by-step.

---

## STEP 1: Create Payroll Models

Create `server/core/payroll_models.py`:

```python
from django.db import models
from django.contrib.postgres.fields import JSONField
from decimal import Decimal
from django.utils import timezone
from .models import BaseModel, Organization, Employee, User

# ============================================================================
# SALARY COMPONENTS & STRUCTURE
# ============================================================================

class SalaryComponent(BaseModel):
    """Configurable salary earning/deduction components"""
    COMPONENT_TYPE = [
        ('earning', 'Earning'),
        ('deduction', 'Deduction'),
    ]
    CALCULATION_METHOD = [
        ('percentage', 'Percentage of Basic'),
        ('fixed', 'Fixed Amount'),
        ('formula', 'Formula-based'),
    ]
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='salary_components')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50)  # e.g., 'HRA', 'DA', 'PF'
    component_type = models.CharField(max_length=20, choices=COMPONENT_TYPE)
    calculation_method = models.CharField(max_length=20, choices=CALCULATION_METHOD)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    fixed_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    formula = models.TextField(null=True, blank=True)  # e.g., 'basic * 0.5 + da'
    is_active = models.BooleanField(default=True)
    is_taxable = models.BooleanField(default=True)
    is_statutory = models.BooleanField(default=False)  # PF, ESI, TDS, etc.
    order = models.IntegerField(default=0)  # Display order
    
    class Meta:
        unique_together = ('organization', 'code')
        ordering = ['component_type', 'order']
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class SalaryStructure(BaseModel):
    """Salary structure template linked to designation"""
    designation = models.OneToOneField('Designation', on_delete=models.CASCADE, related_name='salary_structure')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    base_salary = models.DecimalField(max_digits=12, decimal_places=2)
    ctc = models.DecimalField(max_digits=12, decimal_places=2)
    components = models.ManyToManyField(SalaryComponent, through='SalaryStructureComponent')
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ['-effective_from']
    
    def __str__(self):
        return f"Salary Structure - {self.designation.name}"


class SalaryStructureComponent(models.Model):
    """M2M through table for salary structure components with amounts"""
    salary_structure = models.ForeignKey(SalaryStructure, on_delete=models.CASCADE)
    component = models.ForeignKey(SalaryComponent, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    class Meta:
        unique_together = ('salary_structure', 'component')


class SalaryRevision(BaseModel):
    """Historical salary records (never overwrite previous)"""
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='salary_revisions')
    salary_structure = models.ForeignKey(SalaryStructure, on_delete=models.SET_NULL, null=True, blank=True)
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    base_salary = models.DecimalField(max_digits=12, decimal_places=2)
    ctc = models.DecimalField(max_digits=12, decimal_places=2)
    components = models.JSONField(default=dict)  # {component_code: amount}
    reason = models.CharField(max_length=255, blank=True)  # e.g., 'Annual Increment', 'Promotion', 'Correction'
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        unique_together = ('employee', 'effective_from')
        ordering = ['-effective_from']
    
    def __str__(self):
        return f"{self.employee.user.email} - {self.effective_from}"


# ============================================================================
# BANK ACCOUNT MANAGEMENT
# ============================================================================

class BankAccount(BaseModel):
    """Employee bank account for salary transfer"""
    ACCOUNT_TYPE = [
        ('savings', 'Savings'),
        ('current', 'Current'),
        ('nro', 'NRO'),
        ('nre', 'NRE'),
    ]
    VERIFICATION_STATUS = [
        ('unverified', 'Unverified'),
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('failed', 'Verification Failed'),
    ]
    
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='bank_account')
    account_number = models.CharField(max_length=20)
    ifsc_code = models.CharField(max_length=11)
    bank_name = models.CharField(max_length=100)
    branch_name = models.CharField(max_length=100)
    account_holder_name = models.CharField(max_length=100)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE, default='savings')
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='unverified')
    verification_method = models.CharField(max_length=50, blank=True)  # micro_deposit, instant, etc.
    verification_attempts = models.IntegerField(default=0)
    verified_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('employee', 'account_number', 'ifsc_code')
    
    def __str__(self):
        return f"{self.employee.user.email} - {self.account_number[-4:]}"


# ============================================================================
# PAYROLL PROCESSING
# ============================================================================

class PayrollCycle(BaseModel):
    """Monthly payroll processing cycle"""
    STATUS = [
        ('draft', 'Draft'),
        ('processing', 'Processing'),
        ('preview', 'Preview'),
        ('completed', 'Completed'),
        ('locked', 'Locked'),
        ('failed', 'Failed'),
    ]
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='payroll_cycles')
    month = models.IntegerField()  # 1-12
    year = models.IntegerField()
    period_start = models.DateField()
    period_end = models.DateField()
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    payslip_count = models.IntegerField(default=0)
    total_gross = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_net = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    locked_at = models.DateTimeField(null=True, blank=True)
    locked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='locked_payroll_cycles')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_payroll_cycles')
    processing_notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ('organization', 'month', 'year')
        ordering = ['-year', '-month']
    
    def __str__(self):
        return f"{self.organization.name} - {self.name} ({self.month}/{self.year})"


class Payslip(BaseModel):
    """Monthly payslip for employee"""
    STATUS = [
        ('draft', 'Draft'),
        ('finalized', 'Finalized'),
        ('locked', 'Locked'),
        ('paid', 'Paid'),
    ]
    
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payslips')
    payroll_cycle = models.ForeignKey(PayrollCycle, on_delete=models.CASCADE, related_name='payslips')
    month = models.IntegerField()
    year = models.IntegerField()
    
    # Components breakdown
    earnings = models.JSONField(default=dict)  # {component_name: amount}
    deductions = models.JSONField(default=dict)  # {component_name: amount}
    
    # Summary
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Statutory details
    pf_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    pf_employer = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    esi_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    esi_employer = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    professional_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    income_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Additional info
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    days_worked = models.IntegerField(default=30)
    pay_date = models.DateField(null=True, blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    locked_at = models.DateTimeField(null=True, blank=True)
    pdf_file = models.FileField(upload_to='payslips/%Y/%m/', null=True, blank=True)
    
    class Meta:
        unique_together = ('employee', 'month', 'year')
        ordering = ['-year', '-month']
    
    def __str__(self):
        return f"Payslip - {self.employee.user.email} ({self.month}/{self.year})"


# ============================================================================
# REIMBURSEMENTS
# ============================================================================

class Reimbursement(BaseModel):
    """Employee reimbursement requests"""
    CATEGORY = [
        ('travel', 'Travel'),
        ('meals', 'Meals'),
        ('accommodation', 'Accommodation'),
        ('office_supplies', 'Office Supplies'),
        ('client_entertainment', 'Client Entertainment'),
        ('mobile_recharge', 'Mobile Recharge'),
        ('other', 'Other'),
    ]
    STATUS = [
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('paid', 'Paid'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='reimbursements')
    category = models.CharField(max_length=50, choices=CATEGORY)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    invoice_date = models.DateField()
    expense_date = models.DateField()
    description = models.TextField()
    invoice_file = models.FileField(upload_to='invoices/%Y/%m/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='submitted')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_reimbursements')
    approval_notes = models.TextField(blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    paid_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Reimbursement - {self.employee.user.email} (₹{self.amount})"


# ============================================================================
# LOANS
# ============================================================================

class Loan(BaseModel):
    """Employee loans (salary advance, personal loan, etc.)"""
    LOAN_TYPE = [
        ('personal', 'Personal Loan'),
        ('salary_advance', 'Salary Advance'),
        ('festival_advance', 'Festival Advance'),
        ('emergency_loan', 'Emergency Loan'),
    ]
    STATUS = [
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('default', 'Default'),
        ('written_off', 'Written Off'),
    ]
    
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='loans')
    loan_type = models.CharField(max_length=50, choices=LOAN_TYPE)
    principal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)  # Annual percentage
    tenure_months = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS, default='active')
    remaining_balance = models.DecimalField(max_digits=12, decimal_places=2)
    monthly_emi = models.DecimalField(max_digits=10, decimal_places=2)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return f"Loan - {self.employee.user.email} (₹{self.principal_amount})"


class LoanEMI(BaseModel):
    """Loan EMI details"""
    EMI_STATUS = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('waived', 'Waived'),
    ]
    
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='emis')
    emi_number = models.IntegerField()
    due_date = models.DateField()
    principal_component = models.DecimalField(max_digits=10, decimal_places=2)
    interest_component = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=EMI_STATUS, default='pending')
    paid_date = models.DateField(null=True, blank=True)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    class Meta:
        unique_together = ('loan', 'emi_number')
        ordering = ['loan', 'emi_number']
    
    def __str__(self):
        return f"EMI {self.emi_number} - {self.loan}"


# ============================================================================
# TAX & STATUTORY
# ============================================================================

class TaxSummary(BaseModel):
    """Annual tax summary for employee"""
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='tax_summaries')
    financial_year = models.CharField(max_length=10)  # e.g., '2024-25'
    
    gross_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pf_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    esi_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    professional_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    income_tax_computed = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    income_tax_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tds_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_tax_liability = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    standard_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    taxable_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    class Meta:
        unique_together = ('employee', 'financial_year')
    
    def __str__(self):
        return f"Tax Summary - {self.employee.user.email} ({self.financial_year})"


# ============================================================================
# SETTLEMENT
# ============================================================================

class Settlement(BaseModel):
    """Final settlement on employee exit"""
    REASON = [
        ('resignation', 'Resignation'),
        ('termination', 'Termination'),
        ('retirement', 'Retirement'),
        ('contract_end', 'Contract End'),
        ('vrs', 'VRS'),
    ]
    STATUS = [
        ('draft', 'Draft'),
        ('calculated', 'Calculated'),
        ('approved', 'Approved'),
        ('processed', 'Processed'),
        ('paid', 'Paid'),
    ]
    
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='settlements')
    settlement_date = models.DateField()
    reason = models.CharField(max_length=50, choices=REASON)
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    
    # Calculations
    full_and_final_settlement = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gratuity = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    bonus_payable = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    leave_encashment = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Deductions
    outstanding_loans = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pending_reimbursements = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    advance_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    damages_recovery = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Final
    gross_payable = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gross_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    settlement_details = models.JSONField(default=dict)  # Detailed breakdown
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_settlements')
    processed_date = models.DateField(null=True, blank=True)
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_settlements')
    paid_date = models.DateField(null=True, blank=True)
    
    class Meta:
        ordering = ['-settlement_date']
    
    def __str__(self):
        return f"Settlement - {self.employee.user.email} ({self.reason})"


# ============================================================================
# AUDIT & COMPLIANCE
# ============================================================================

class PayrollAuditLog(BaseModel):
    """Audit trail for all payroll operations"""
    ACTION = [
        ('calculate', 'Calculate Payroll'),
        ('lock', 'Lock Payroll'),
        ('unlock', 'Unlock Payroll'),
        ('finalize', 'Finalize Payroll'),
        ('generate_payslips', 'Generate Payslips'),
        ('export_bank_file', 'Export Bank File'),
        ('modify_salary', 'Modify Salary'),
        ('create_settlement', 'Create Settlement'),
        ('other', 'Other'),
    ]
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    action = models.CharField(max_length=50, choices=ACTION)
    payroll_cycle = models.ForeignKey(PayrollCycle, on_delete=models.SET_NULL, null=True, blank=True)
    affected_employees_count = models.IntegerField(default=0)
    affected_payslips_count = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    details = models.JSONField(default=dict)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.timestamp}"
```

---

## STEP 2: Update Models.py

Add imports and register new models:

```python
# Add to server/core/models.py
from .payroll_models import (
    SalaryComponent, SalaryStructure, SalaryStructureComponent,
    SalaryRevision, BankAccount, PayrollCycle, Payslip,
    Reimbursement, Loan, LoanEMI, TaxSummary, Settlement, PayrollAuditLog
)

# Register in __all__
__all__ = [
    # ... existing models ...
    'SalaryComponent', 'SalaryStructure', 'SalaryStructureComponent',
    'SalaryRevision', 'BankAccount', 'PayrollCycle', 'Payslip',
    'Reimbursement', 'Loan', 'LoanEMI', 'TaxSummary', 'Settlement', 'PayrollAuditLog'
]
```

---

## STEP 3: Create Migrations

```bash
cd server
python manage.py makemigrations core
python manage.py migrate core
```

---

## STEP 4: Update Permissions

Add payroll permissions to the existing permission system in `models.py`.

---

## STEP 5: Create Serializers

Create `server/core/payroll_serializers.py` following the existing pattern.

---

## STEP 6: Create Services Layer

Create `server/core/payroll_services.py` for business logic:
- PayrollCalculationService
- PayslipGenerationService
- ReimbursementApprovalService
- LoanManagementService
- SettlementProcessingService

---

## STEP 7: Create API Views

Create `server/core/payroll_views.py` with ViewSets for all models.

---

## STEP 8: Register URLs

Add to `server/core/urls.py`:

```python
from .payroll_views import (
    SalaryComponentViewSet, SalaryStructureViewSet, SalaryRevisionViewSet,
    # ... other viewsets
)

router.register(r'payroll/salary-components', SalaryComponentViewSet, basename='salary-component')
router.register(r'payroll/salary-structures', SalaryStructureViewSet, basename='salary-structure')
# ... register other viewsets
```

---

## STEP 9: Create Frontend Components

Start with Employee Portal:
1. Payslip viewer
2. Salary structure viewer
3. Tax summary
4. Reimbursement request form
5. Bank account management

Then Payroll Manager Portal:
1. Salary management dashboard
2. Payroll cycle processing
3. Payslip preview and generation
4. Reimbursement approval workflow
5. Reports and audit trails

---

## Key Considerations

1. **Monetary Accuracy**: Always use Decimal type
2. **Historical Records**: Never overwrite previous salaries
3. **Audit Trail**: Log all modifications
4. **Multi-tenancy**: Always filter by organization
5. **Security**: Implement row-level permission checks
6. **Validation**: Server-side validation for all inputs

---

## Timeline

- **Week 1**: Models, Migrations, Permissions
- **Week 2**: Serializers, Services, API Endpoints
- **Week 3**: Frontend Components (Employee + Manager)
- **Week 4**: Reports, Testing, Optimization, Deployment

