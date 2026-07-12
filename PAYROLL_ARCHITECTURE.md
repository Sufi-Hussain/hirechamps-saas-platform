# HireChamps Payroll Module - Production-Ready Architecture

## Overview
Complete payroll management system with configurable rules, multi-tenant support, and audit trails for both Employee Portal and Payroll Manager Portal.

---

## 1. FOLDER/MODULE ARCHITECTURE

### Backend Structure
```
server/core/
├── payroll/                          # Payroll module
│   ├── __init__.py
│   ├── models.py                     # PayrollCycle, SalaryComponent, SalaryRevision, Payslip, Reimbursement, Loan, TaxSummary, etc.
│   ├── serializers.py                # All DRF serializers
│   ├── views.py                      # Viewsets and API views
│   ├── services.py                   # Business logic (calculations, processing)
│   ├── permissions.py                # Permission classes
│   ├── filters.py                    # Custom filters
│   └── migrations/                   # Database migrations
├── payroll_rules.py                  # [EXISTING] Rule engine
└── urls.py                           # [UPDATE] Add payroll routes
```

### Frontend Structure
```
app/dashboard/payroll/
├── page.tsx                          # [UPDATE] Main payroll dashboard
├── manager/
│   ├── page.tsx                      # Payroll Manager Dashboard
│   ├── employees/
│   │   ├── page.tsx                  # Salary Management
│   │   ├── [id]/
│   │   │   └── page.tsx              # Individual employee salary
│   │   └── components/
│   │       ├── SalaryStructureForm.tsx
│   │       └── SalaryRevisionForm.tsx
│   ├── structures/
│   │   ├── page.tsx                  # Salary Structure Templates
│   │   └── components/
│   │       └── SalaryStructureBuilder.tsx
│   ├── payroll/
│   │   ├── page.tsx                  # Payroll Processing
│   │   ├── [cycleId]/
│   │   │   ├── page.tsx              # Cycle Details
│   │   │   └── components/
│   │   │       ├── PayrollPreview.tsx
│   │   │       ├── PayslipGenerator.tsx
│   │   │       └── BankTransferExport.tsx
│   │   └── components/
│   │       └── PayrollCycleForm.tsx
│   ├── reimbursements/
│   │   ├── page.tsx                  # Reimbursement Approvals
│   │   └── components/
│   │       └── ReimbursementApprovalList.tsx
│   ├── loans/
│   │   ├── page.tsx                  # Loan Management
│   │   └── components/
│   │       ├── LoanForm.tsx
│   │       └── LoanTracker.tsx
│   ├── reports/
│   │   ├── page.tsx                  # Payroll Reports
│   │   └── components/
│   │       ├── SalaryRegister.tsx
│   │       ├── StatutoryDeductions.tsx
│   │       ├── TDSReport.tsx
│   │       └── SettlementReport.tsx
│   └── audit/
│       └── page.tsx                  # Payroll Audit Trail
├── employee/
│   ├── page.tsx                      # Employee Payroll Dashboard
│   ├── structures/
│   │   ├── page.tsx                  # View Salary Structure
│   │   └── components/
│   │       └── SalaryBreakdown.tsx
│   ├── payslips/
│   │   ├── page.tsx                  # View/Download Payslips
│   │   ├── [id]/
│   │   │   └── page.tsx              # Payslip Details
│   │   └── components/
│   │       └── PayslipViewer.tsx
│   ├── tax/
│   │   ├── page.tsx                  # Tax Summary
│   │   └── components/
│   │       ├── TDSSummary.tsx
│   │       └── IncomeTaxSummary.tsx
│   ├── reimbursements/
│   │   ├── page.tsx                  # Reimbursement Requests
│   │   └── components/
│   │       ├── ReimbursementForm.tsx
│   │       └── ReimbursementHistory.tsx
│   ├── loans/
│   │   ├── page.tsx                  # Loan Details
│   │   └── components/
│   │       └── LoanRepaymentSchedule.tsx
│   ├── bank/
│   │   ├── page.tsx                  # Bank Account Management
│   │   └── components/
│   │       ├── BankAccountForm.tsx
│   │       └── BankVerification.tsx
│   ├── settlements/
│   │   └── page.tsx                  # Final Settlement
│   └── history/
│       └── page.tsx                  # Payroll History

components/payroll/
├── manager/
│   ├── SalaryStructureForm.tsx
│   ├── SalaryRevisionForm.tsx
│   ├── PayrollCycleForm.tsx
│   ├── PayslipGenerator.tsx
│   ├── PayrollPreview.tsx
│   ├── BankTransferExport.tsx
│   ├── ReimbursementApprovalList.tsx
│   ├── LoanForm.tsx
│   └── LoanTracker.tsx
└── employee/
    ├── SalaryBreakdown.tsx
    ├── PayslipViewer.tsx
    ├── TDSSummary.tsx
    ├── ReimbursementForm.tsx
    ├── ReimbursementHistory.tsx
    ├── LoanRepaymentSchedule.tsx
    ├── BankAccountForm.tsx
    └── BankVerification.tsx

hooks/
├── usePayrollManager.ts              # Payroll manager operations
├── useEmployeePayroll.ts             # Employee payroll view
├── useSalaryStructure.ts             # Salary structure management
├── usePayslips.ts                    # Payslip operations
├── useReimbursements.ts              # Reimbursement operations
└── useLoans.ts                       # Loan operations

lib/schemas/payroll/
├── salary.ts                         # Salary-related schemas
├── payroll.ts                        # Payroll processing schemas
├── reimbursement.ts                  # Reimbursement schemas
└── loan.ts                           # Loan schemas

types/payroll.ts                      # All payroll TypeScript types
```

---

## 2. DATABASE MODELS

### Core Models

#### SalaryComponent
- id, organization, name, type (earning/deduction), calculation_method, percentage/amount, active, created_at
- Links: organization

#### SalaryStructure (Enhanced)
- designation, components (M2M), base_salary, ctc, effective_from, effective_to, created_by, created_at
- Links: designation, created_by (User)

#### SalaryRevision (Historical)
- employee, salary_structure, effective_from, effective_to, base_salary, ctc, additional_components, revision_reason, created_by, created_at
- Links: employee, created_by, salary_structure
- Unique: (employee, effective_from) to prevent overlaps

#### BankAccount
- employee, account_number, ifsc, bank_name, branch_name, account_holder_name, account_type (savings/current), verified, verification_method (micro_deposit/instant), verified_at, created_at
- Links: employee

#### PayrollCycle
- organization, period_start, period_end, name, status (draft/processing/completed/locked), locked_at, locked_by, created_by, created_at
- Links: organization, locked_by, created_by

#### Payslip
- employee, payroll_cycle, earnings (JSONField), deductions (JSONField), gross, net, status, generated_at, locked, locked_at, generated_by
- Links: employee, payroll_cycle, generated_by

#### PayslipComponent
- payslip, salary_component, amount, calculation_details (JSONField)
- Links: payslip, salary_component

#### Reimbursement
- employee, category, amount, invoice_date, expense_date, description, invoice_file (FileField), status (pending/approved/rejected/paid), approved_by, approved_at, paid_date, created_at
- Links: employee, approved_by (User)

#### Loan
- employee, principal_amount, interest_rate, tenure_months, start_date, status (active/closed/default), remaining_balance, created_by, created_at
- Links: employee, created_by

#### LoanEMI
- loan, emi_number, due_date, principal_component, interest_component, amount, paid_date, status (pending/paid/overdue)
- Links: loan

#### TaxSummary
- employee, financial_year, gross_income, pf_deduction, esi_deduction, professional_tax, income_tax_computed, income_tax_paid, tds_paid, net_tax_liability, created_at
- Links: employee

#### Settlement
- employee, settlement_date, reason (resignation/termination/retirement), full_and_final_settlement, gratuity, outstanding_loans, pending_reimbursements, final_amount, status (draft/processed/paid), created_by, processed_date
- Links: employee, created_by

#### PayrollAuditLog
- organization, action (calculate/lock/unlock/process), payroll_cycle, affected_payslips_count, user, timestamp, details (JSONField)
- Links: organization, payroll_cycle, user

---

## 3. API ENDPOINTS

### Payroll Manager Endpoints

#### Salary Management
- `GET /api/payroll/salary-structures/` - List salary structures
- `POST /api/payroll/salary-structures/` - Create salary structure
- `PUT /api/payroll/salary-structures/{id}/` - Update salary structure
- `GET /api/payroll/salary-components/` - List salary components
- `POST /api/payroll/salary-components/` - Create component
- `PUT /api/payroll/employees/{id}/salary-revision/` - Create salary revision (non-destructive)
- `GET /api/payroll/employees/{id}/salary-history/` - View salary history
- `POST /api/payroll/employees/{id}/salary-revision/apply/` - Apply salary revision

#### Payroll Processing
- `POST /api/payroll/cycles/` - Create payroll cycle
- `GET /api/payroll/cycles/` - List payroll cycles
- `GET /api/payroll/cycles/{id}/` - Get cycle details
- `POST /api/payroll/cycles/{id}/calculate/` - Calculate payslips for cycle
- `GET /api/payroll/cycles/{id}/preview/` - Preview payslips before finalization
- `POST /api/payroll/cycles/{id}/finalize/` - Finalize and lock payroll
- `POST /api/payroll/cycles/{id}/generate-payslips/` - Generate payslip PDFs
- `POST /api/payroll/cycles/{id}/export-bank-transfer/` - Export bank transfer file (NEFT/RTGS format)
- `POST /api/payroll/cycles/{id}/unlock/` - Unlock payroll (only if permitted)

#### Reimbursement Management
- `GET /api/payroll/reimbursements/` - List all reimbursements
- `POST /api/payroll/reimbursements/{id}/approve/` - Approve reimbursement
- `POST /api/payroll/reimbursements/{id}/reject/` - Reject reimbursement
- `POST /api/payroll/reimbursements/{id}/mark-paid/` - Mark as paid

#### Loan Management
- `GET /api/payroll/loans/` - List loans
- `POST /api/payroll/loans/` - Create new loan
- `GET /api/payroll/loans/{id}/` - Get loan details
- `PUT /api/payroll/loans/{id}/` - Update loan
- `GET /api/payroll/loans/{id}/schedule/` - Get EMI schedule
- `POST /api/payroll/loans/{id}/record-payment/` - Record EMI payment
- `POST /api/payroll/loans/{id}/close/` - Close loan

#### Reports
- `GET /api/payroll/reports/salary-register/` - Salary register report
- `GET /api/payroll/reports/statutory-deductions/` - Statutory deductions summary
- `GET /api/payroll/reports/tds-summary/` - TDS report
- `GET /api/payroll/reports/settlement-report/` - Settlement report
- `GET /api/payroll/reports/audit-trail/` - Audit trail

#### Settlement
- `POST /api/payroll/settlements/` - Create final settlement
- `GET /api/payroll/settlements/{id}/` - Get settlement details
- `POST /api/payroll/settlements/{id}/process/` - Process settlement
- `POST /api/payroll/settlements/{id}/mark-paid/` - Mark settlement as paid

### Employee Endpoints

#### Salary & Payslips
- `GET /api/payroll/employee/salary-structure/` - View current salary structure
- `GET /api/payroll/employee/payslips/` - List payslips
- `GET /api/payroll/employee/payslips/{id}/` - Get payslip details
- `GET /api/payroll/employee/payslips/{id}/download/` - Download payslip PDF

#### Tax Information
- `GET /api/payroll/employee/tax-summary/{financial_year}/` - Tax summary for FY
- `GET /api/payroll/employee/tds-certificates/` - TDS certificates (Form 16)

#### Reimbursement Requests
- `POST /api/payroll/employee/reimbursements/` - Submit reimbursement request
- `GET /api/payroll/employee/reimbursements/` - View reimbursement requests
- `GET /api/payroll/employee/reimbursements/{id}/` - Get request details
- `DELETE /api/payroll/employee/reimbursements/{id}/` - Withdraw reimbursement (if pending)

#### Loan Details
- `GET /api/payroll/employee/loans/` - View loans
- `GET /api/payroll/employee/loans/{id}/schedule/` - View EMI schedule

#### Bank Account
- `POST /api/payroll/employee/bank-account/` - Register/update bank account
- `GET /api/payroll/employee/bank-account/` - Get bank account details
- `POST /api/payroll/employee/bank-account/verify/` - Initiate verification
- `POST /api/payroll/employee/bank-account/confirm-verification/` - Confirm verification with micro-deposit amount

#### Settlement
- `GET /api/payroll/employee/settlement/` - View final settlement

---

## 4. PERMISSION CHANGES

Add to existing Role Permission system:

```python
PAYROLL_PERMISSIONS = [
    ('payroll.view_salary_structure', 'Can view salary structures'),
    ('payroll.manage_salary_structure', 'Can create/edit salary structures'),
    ('payroll.view_employee_salary', 'Can view employee salary details'),
    ('payroll.manage_employee_salary', 'Can manage employee salary revisions'),
    ('payroll.process_payroll', 'Can create and process payroll cycles'),
    ('payroll.finalize_payroll', 'Can lock and finalize payroll'),
    ('payroll.unlock_payroll', 'Can unlock processed payroll (audit)'),
    ('payroll.approve_reimbursement', 'Can approve/reject reimbursements'),
    ('payroll.manage_loans', 'Can create and manage employee loans'),
    ('payroll.view_reports', 'Can view payroll reports'),
    ('payroll.audit_payroll', 'Can view payroll audit trails'),
    ('payroll.process_settlement', 'Can process final settlements'),
    ('payroll.view_own_payroll', 'Employee: Can view own payroll data'),
    ('payroll.submit_reimbursement', 'Employee: Can submit reimbursement requests'),
    ('payroll.manage_bank_account', 'Employee: Can manage own bank account'),
]

ROLE_PERMISSIONS = {
    'payroll_manager': [
        'payroll.view_salary_structure',
        'payroll.manage_salary_structure',
        'payroll.view_employee_salary',
        'payroll.manage_employee_salary',
        'payroll.process_payroll',
        'payroll.finalize_payroll',
        'payroll.approve_reimbursement',
        'payroll.manage_loans',
        'payroll.view_reports',
    ],
    'hr_manager': [
        'payroll.view_salary_structure',
        'payroll.view_employee_salary',
        'payroll.approve_reimbursement',
        'payroll.view_reports',
    ],
    'employee': [
        'payroll.view_own_payroll',
        'payroll.submit_reimbursement',
        'payroll.manage_bank_account',
    ],
    'company_owner': [
        '*',  # All payroll permissions
        'payroll.unlock_payroll',
        'payroll.process_settlement',
        'payroll.audit_payroll',
    ],
}
```

---

## 5. IMPLEMENTATION ORDER

### Phase 1: Core Models & Backend (Week 1)
1. Create `payroll/models.py` with all models
2. Create serializers for all models
3. Create permission classes
4. Add migrations
5. Create service layer for calculations

### Phase 2: API Endpoints - Payroll Manager (Week 2)
1. Salary structure management endpoints
2. Payroll cycle and calculation endpoints
3. Payslip management endpoints
4. Reimbursement approval endpoints
5. Loan management endpoints

### Phase 3: API Endpoints - Employee (Week 2)
1. Employee payroll view endpoints
2. Payslip download endpoints
3. Tax summary endpoints
4. Reimbursement request endpoints
5. Bank account management endpoints

### Phase 4: Frontend - Payroll Manager (Week 3)
1. Main payroll manager dashboard
2. Salary structure builder
3. Payroll cycle processing UI
4. Payslip preview and generation
5. Reimbursement and loan management UIs
6. Reports dashboards

### Phase 5: Frontend - Employee (Week 3)
1. Employee payroll dashboard
2. Payslip viewer and downloader
3. Tax summary viewer
4. Reimbursement request form
5. Bank account management
6. Loan details viewer

### Phase 6: Reports & Audit (Week 4)
1. Payroll reports generation
2. Audit trail logging
3. Settlement processing

### Phase 7: Testing & Deployment (Week 4)
1. Unit tests for services
2. Integration tests for APIs
3. E2E tests for critical flows
4. Performance optimization
5. Deployment

---

## 6. KEY FEATURES

### Salary Management
- Non-destructive salary revisions with historical tracking
- Support for multiple salary structures
- Flexible earnings/deductions components
- Bulk salary updates with effective dates

### Payroll Processing
- Monthly payroll cycle management
- Configurable payroll rules (taxes, PF, ESI, PT, gratuity)
- Payslip generation and storage
- Audit trail for all payroll actions

### Deductions & Statutory
- Income Tax (configurable tax slabs)
- Provident Fund (employee + employer)
- ESI (employee + employer)
- Professional Tax (state-wise)
- Custom deductions support

### Reimbursement Management
- Multi-category support (travel, meals, accommodation, etc.)
- Document upload and verification
- Approval workflow
- Integration with payroll (automatic salary inclusion)

### Loan Management
- Loan creation with interest calculation
- EMI schedule generation
- Automatic EMI deduction from salary
- Early closure support

### Employee Settlement
- Gratuity calculation
- Final settlement amount calculation
- Outstanding loan adjustment
- Pending reimbursement adjustment

### Reports & Analytics
- Salary register
- Statutory deduction summaries
- TDS report (Form 16)
- Settlement report
- Audit trail reporting

### Security & Compliance
- Role-based access control
- Audit logging for all payroll actions
- Payroll locking mechanism (prevent modifications)
- Complete historical tracking
- Multi-tenant isolation

---

## 7. TECHNOLOGY STACK

### Backend
- Django 4.2+
- Django REST Framework
- Decimal for monetary calculations
- Python-dateutil for date operations
- Weasyprint for PDF generation
- Celery for async payroll processing (future)

### Frontend
- Next.js 16
- React Hook Form for forms
- Zod for validation
- SWR for data fetching
- shadcn/ui for components
- date-fns for date handling
- jsPDF for PDF download

---

## 8. SECURITY CONSIDERATIONS

1. **Monetary Accuracy**: Use Decimal type for all currency values (never float)
2. **Audit Trail**: Log all payroll modifications with user, timestamp, and action
3. **Payroll Locking**: Prevent modifications to processed payroll cycles
4. **Permission Checks**: Implement row-level security for multi-tenant
5. **Data Privacy**: Mask sensitive data (bank account numbers, sensitive income details)
6. **Validation**: Server-side validation for all inputs, especially financial data

---

## 9. CONFIGURATION OPTIONS

All configurable via environment variables or database settings:

```python
PAYROLL_CONFIG = {
    'TAX_REGIME': 'new',  # new or old
    'PF_APPLICABLE': True,
    'ESI_APPLICABLE': True,
    'PT_APPLICABLE': True,
    'DEFAULT_STATE': 'MH',
    'PAYSLIP_PDF_TEMPLATE': 'custom_template.html',
    'SETTLEMENT_GRATUITY_DIVISOR': 26,  # Standard: 15 days per year
    'MAX_GRATUITY_AMOUNT': 2000000,
    'ALLOW_PAYROLL_UNLOCK': False,  # Security: prevent payroll modification
    'AUTOMATIC_PAYSLIP_EMAIL': True,
    'BANK_TRANSFER_FILE_FORMAT': 'NEFT',  # NEFT, RTGS, IMPS
}
```

---

## 10. TESTING STRATEGY

### Unit Tests
- Payroll rule calculations
- Salary revision logic
- Settlement calculations
- EMI generation
- Tax calculations

### Integration Tests
- Complete payroll cycle (create → calculate → finalize → generate payslips)
- Reimbursement approval workflow
- Loan EMI deduction from salary
- Employee access to own payroll data
- Permission enforcement

### E2E Tests
- Payroll manager complete workflow
- Employee portal payslip access
- Bank transfer file generation
- Settlement processing

---

## 11. FUTURE ENHANCEMENTS

1. Async payroll processing with Celery
2. Salary advance/loan against salary
3. Expense claims with approval workflow
4. Performance bonus calculation
5. Leave encashment calculation
6. Form 16 generation
7. Bulk salary import/export
8. API integration with payroll software
9. SMS/Email notifications for payslips
10. Compliance reports (statutory filings)

