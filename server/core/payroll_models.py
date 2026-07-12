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
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    base_salary = models.DecimalField(max_digits=12, decimal_places=2)
    ctc = models.DecimalField(max_digits=12, decimal_places=2)
    components = models.JSONField(default=dict)  # {component_code: amount}
    reason = models.CharField(max_length=255, blank=True)  # e.g., 'Annual Increment'
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
    ]
    VERIFICATION_STATUS = [
        ('unverified', 'Unverified'),
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
    ]
    
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='bank_account')
    account_number = models.CharField(max_length=20)
    ifsc_code = models.CharField(max_length=11)
    bank_name = models.CharField(max_length=100)
    branch_name = models.CharField(max_length=100)
    account_holder_name = models.CharField(max_length=100)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE, default='savings')
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='unverified')
    verified_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('employee', 'account_number')
    
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
        ('locked', 'Locked'),
        ('released', 'Released'),
        ('archived', 'Archived'),
    ]
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='payroll_cycles')
    month = models.IntegerField()  # 1-12
    year = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    start_date = models.DateField()
    end_date = models.DateField()
    salary_due_date = models.DateField()
    total_employees = models.IntegerField(default=0)
    processed_employees = models.IntegerField(default=0)
    released_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    released_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('organization', 'month', 'year')
        ordering = ['-year', '-month']
    
    def __str__(self):
        return f"Payroll {self.month}/{self.year} - {self.status}"


class Payslip(BaseModel):
    """Employee payslip for a payroll cycle"""
    STATUS = [
        ('draft', 'Draft'),
        ('processed', 'Processed'),
        ('approved', 'Approved'),
        ('released', 'Released'),
    ]
    
    payroll_cycle = models.ForeignKey(PayrollCycle, on_delete=models.CASCADE, related_name='payslips')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payslips')
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    base_salary = models.DecimalField(max_digits=12, decimal_places=2)
    earnings = models.JSONField(default=dict)  # {component_code: amount}
    deductions = models.JSONField(default=dict)  # {component_code: amount}
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pf_contribution = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    days_worked = models.IntegerField(default=30)
    working_days = models.IntegerField(default=30)
    leave_days = models.IntegerField(default=0)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_payslips')
    approved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('payroll_cycle', 'employee')
        ordering = ['-payroll_cycle__year', '-payroll_cycle__month']
    
    def __str__(self):
        return f"Payslip {self.employee.user.email} - {self.payroll_cycle}"


# ============================================================================
# EMPLOYEE BENEFITS & DEDUCTIONS
# ============================================================================

class Reimbursement(BaseModel):
    """Reimbursement requests from employees"""
    CATEGORY = [
        ('travel', 'Travel'),
        ('meal', 'Meals'),
        ('entertainment', 'Entertainment'),
        ('medical', 'Medical'),
        ('other', 'Other'),
    ]
    STATUS = [
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('paid', 'Paid'),
    ]
    
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='reimbursements')
    category = models.CharField(max_length=20, choices=CATEGORY)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    receipt_file = models.FileField(upload_to='reimbursements/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='submitted')
    submitted_date = models.DateField(auto_now_add=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    approved_date = models.DateField(null=True, blank=True)
    approval_comments = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-submitted_date']
    
    def __str__(self):
        return f"Reimbursement - {self.employee.user.email} - {self.amount}"


class Loan(BaseModel):
    """Employee loan management"""
    STATUS = [
        ('applied', 'Applied'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('active', 'Active'),
        ('closed', 'Closed'),
    ]
    LOAN_TYPE = [
        ('personal', 'Personal Loan'),
        ('home', 'Home Loan'),
        ('education', 'Education Loan'),
        ('advance', 'Salary Advance'),
    ]
    
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='loans')
    loan_type = models.CharField(max_length=20, choices=LOAN_TYPE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tenure_months = models.IntegerField()  # Loan duration in months
    emi_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS, default='applied')
    disbursement_date = models.DateField(null=True, blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    remaining_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Loan - {self.employee.user.email} - {self.amount}"


class LoanEMI(BaseModel):
    """Individual EMI records for loans"""
    STATUS = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('missed', 'Missed'),
    ]
    
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='emis')
    emi_number = models.IntegerField()
    due_date = models.DateField()
    emi_amount = models.DecimalField(max_digits=12, decimal_places=2)
    principal = models.DecimalField(max_digits=12, decimal_places=2)
    interest = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    paid_date = models.DateField(null=True, blank=True)
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    class Meta:
        unique_together = ('loan', 'emi_number')
        ordering = ['loan', 'emi_number']
    
    def __str__(self):
        return f"EMI {self.emi_number} - {self.loan.employee.user.email}"


# ============================================================================
# TAX & COMPLIANCE
# ============================================================================

class TaxSummary(BaseModel):
    """Annual tax summary per employee"""
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='tax_summary')
    financial_year_start = models.DateField()
    financial_year_end = models.DateField()
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    standard_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_deducted = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pf_contribution = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    taxable_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    class Meta:
        unique_together = ('employee', 'financial_year_start')
    
    def __str__(self):
        return f"Tax Summary - {self.employee.user.email}"


class Settlement(BaseModel):
    """Final settlement on employee exit"""
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='settlements')
    exit_date = models.DateField()
    gratuity_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    leave_encashment = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pending_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pending_reimbursement = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_payable = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_settlement = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    processed = models.BooleanField(default=False)
    processed_date = models.DateField(null=True, blank=True)
    
    class Meta:
        ordering = ['-exit_date']
    
    def __str__(self):
        return f"Settlement - {self.employee.user.email}"


class PayrollAuditLog(BaseModel):
    """Audit trail for all payroll changes"""
    ACTION_TYPES = [
        ('component_created', 'Component Created'),
        ('component_updated', 'Component Updated'),
        ('salary_revised', 'Salary Revised'),
        ('payroll_processed', 'Payroll Processed'),
        ('payslip_approved', 'Payslip Approved'),
        ('payslip_released', 'Payslip Released'),
        ('reimbursement_approved', 'Reimbursement Approved'),
        ('loan_approved', 'Loan Approved'),
        ('settlement_processed', 'Settlement Processed'),
    ]
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    entity_type = models.CharField(max_length=50)  # Model name
    entity_id = models.IntegerField()
    old_values = models.JSONField(default=dict)
    new_values = models.JSONField(default=dict)
    change_summary = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['organization', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.action_type} - {self.user.email if self.user else 'System'}"
