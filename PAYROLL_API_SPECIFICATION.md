# Payroll Module - Complete API Specification

## Authentication & Permissions

All endpoints require Bearer token authentication.

### Required Permissions by Endpoint

```
PAYROLL_MANAGER_ROLE: [
  'payroll.manage_salary_structure',
  'payroll.process_payroll',
  'payroll.finalize_payroll',
  'payroll.approve_reimbursement',
  'payroll.manage_loans',
  'payroll.view_reports'
]

HR_MANAGER_ROLE: [
  'payroll.view_salary_structure',
  'payroll.view_employee_salary',
  'payroll.approve_reimbursement'
]

EMPLOYEE_ROLE: [
  'payroll.view_own_payroll',
  'payroll.submit_reimbursement',
  'payroll.manage_bank_account'
]
```

---

## PAYROLL MANAGER ENDPOINTS

### 1. Salary Components Management

#### List Salary Components
```
GET /api/payroll/salary-components/
Query Parameters:
  - organization_id (required)
  - component_type: earning | deduction
  - is_active: true | false

Response:
{
  "count": 25,
  "next": "...",
  "previous": "...",
  "results": [
    {
      "id": "uuid",
      "name": "Dearness Allowance",
      "code": "DA",
      "component_type": "earning",
      "calculation_method": "percentage",
      "percentage": 15.5,
      "is_taxable": true,
      "is_statutory": false,
      "order": 1,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Salary Component
```
POST /api/payroll/salary-components/
{
  "organization_id": "uuid",
  "name": "House Rent Allowance",
  "code": "HRA",
  "component_type": "earning",
  "calculation_method": "percentage",
  "percentage": 40.0,
  "is_taxable": true,
  "is_statutory": false,
  "order": 2
}

Response: 201 Created
{
  "id": "uuid",
  "name": "House Rent Allowance",
  "code": "HRA",
  ...
}
```

#### Update Salary Component
```
PUT /api/payroll/salary-components/{id}/
{
  "percentage": 45.0,
  "is_active": true
}

Response: 200 OK
```

#### Delete Salary Component
```
DELETE /api/payroll/salary-components/{id}/
Response: 204 No Content
```

---

### 2. Salary Structure Management

#### List Salary Structures
```
GET /api/payroll/salary-structures/
Query Parameters:
  - organization_id (required)
  - designation_id
  - effective_date

Response:
{
  "count": 10,
  "results": [
    {
      "id": "uuid",
      "designation": {
        "id": "uuid",
        "name": "Software Engineer"
      },
      "base_salary": 50000,
      "ctc": 75000,
      "components": [
        {
          "id": "uuid",
          "code": "DA",
          "name": "Dearness Allowance",
          "amount": 8000
        }
      ],
      "effective_from": "2024-01-01",
      "effective_to": null,
      "created_by": "admin@example.com"
    }
  ]
}
```

#### Create Salary Structure
```
POST /api/payroll/salary-structures/
{
  "designation_id": "uuid",
  "base_salary": 50000,
  "ctc": 75000,
  "components": [
    {
      "component_id": "uuid",
      "amount": 8000
    }
  ],
  "effective_from": "2024-01-01"
}

Response: 201 Created
```

#### Update Salary Structure (creates new revision)
```
PUT /api/payroll/salary-structures/{id}/
{
  "base_salary": 52000,
  "ctc": 78000,
  "components": [...],
  "effective_from": "2024-07-01"
}

Response: 200 OK
```

---

### 3. Employee Salary Management

#### Get Employee Salary History
```
GET /api/payroll/employees/{employee_id}/salary-history/
Query Parameters:
  - from_date
  - to_date
  - limit: 50

Response:
{
  "count": 3,
  "results": [
    {
      "id": "uuid",
      "effective_from": "2024-07-01",
      "effective_to": null,
      "base_salary": 52000,
      "ctc": 78000,
      "components": {...},
      "reason": "Annual Increment",
      "created_by": "admin@example.com",
      "created_at": "2024-06-30T00:00:00Z"
    }
  ]
}
```

#### Create Salary Revision
```
POST /api/payroll/employees/{employee_id}/salary-revision/
{
  "effective_from": "2024-07-01",
  "base_salary": 52000,
  "ctc": 78000,
  "components": {
    "DA": 8500,
    "HRA": 20800
  },
  "reason": "Annual Increment"
}

Response: 201 Created
{
  "id": "uuid",
  "employee_id": "uuid",
  "effective_from": "2024-07-01",
  "base_salary": 52000,
  "ctc": 78000,
  "components": {...},
  "created_at": "2024-06-30T00:00:00Z"
}
```

---

### 4. Payroll Cycle Management

#### Create Payroll Cycle
```
POST /api/payroll/cycles/
{
  "organization_id": "uuid",
  "month": 7,
  "year": 2024,
  "period_start": "2024-07-01",
  "period_end": "2024-07-31",
  "name": "July 2024 Payroll"
}

Response: 201 Created
{
  "id": "uuid",
  "month": 7,
  "year": 2024,
  "period_start": "2024-07-01",
  "period_end": "2024-07-31",
  "status": "draft",
  "payslip_count": 0,
  "total_gross": 0,
  "total_deductions": 0,
  "total_net": 0,
  "created_at": "2024-07-01T00:00:00Z"
}
```

#### List Payroll Cycles
```
GET /api/payroll/cycles/
Query Parameters:
  - organization_id (required)
  - status: draft | processing | preview | completed | locked
  - year: 2024
  - month: 7

Response:
{
  "count": 12,
  "results": [...]
}
```

#### Get Payroll Cycle Details
```
GET /api/payroll/cycles/{id}/
Response:
{
  "id": "uuid",
  "month": 7,
  "year": 2024,
  ...payroll data...
  "payslips": [
    {
      "id": "uuid",
      "employee_id": "uuid",
      "employee_name": "John Doe",
      "gross_salary": 75000,
      "net_salary": 60000,
      "status": "finalized"
    }
  ]
}
```

#### Calculate Payslips for Cycle
```
POST /api/payroll/cycles/{id}/calculate/
{
  "recalculate": false,
  "exclude_employees": []
}

Response: 200 OK
{
  "status": "success",
  "payslips_calculated": 156,
  "total_gross": 11750000,
  "total_deductions": 1750000,
  "total_net": 10000000,
  "errors": []
}
```

#### Preview Payslips
```
GET /api/payroll/cycles/{id}/preview/
Query Parameters:
  - limit: 10
  - offset: 0

Response:
{
  "count": 156,
  "total_gross": 11750000,
  "total_deductions": 1750000,
  "total_net": 10000000,
  "payslips": [
    {
      "id": "uuid",
      "employee_id": "uuid",
      "employee_name": "John Doe",
      "earnings": {...},
      "deductions": {...},
      "gross_salary": 75000,
      "total_deductions": 15000,
      "net_salary": 60000
    }
  ]
}
```

#### Finalize Payroll Cycle
```
POST /api/payroll/cycles/{id}/finalize/
{
  "confirm": true,
  "notes": "Verified and approved for processing"
}

Response: 200 OK
{
  "status": "success",
  "cycle_id": "uuid",
  "payslips_finalized": 156,
  "locked_at": "2024-07-05T10:00:00Z",
  "locked_by": "admin@example.com"
}
```

#### Generate Payslips (PDF)
```
POST /api/payroll/cycles/{id}/generate-payslips/
{
  "template": "standard",
  "email_payslips": true
}

Response: 200 OK
{
  "status": "success",
  "payslips_generated": 156,
  "job_id": "celery-task-uuid",
  "estimated_completion": "5 minutes"
}
```

#### Export Bank Transfer File
```
POST /api/payroll/cycles/{id}/export-bank-transfer/
{
  "format": "NEFT",  # NEFT | RTGS | IMPS | CSV
  "only_verified_accounts": true
}

Response: 200 OK (File Download)
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="bank_transfer_2024_07.txt"
```

#### Unlock Payroll Cycle (Audit Only)
```
POST /api/payroll/cycles/{id}/unlock/
{
  "reason": "Correction required - overtime adjustment"
}

Permissions Required:
  - 'payroll.unlock_payroll' (Only Company Owner / HR Manager)

Response: 200 OK
{
  "status": "success",
  "cycle_id": "uuid",
  "unlocked_at": "2024-07-05T11:00:00Z",
  "unlocked_by": "admin@example.com",
  "unlock_reason": "Correction required - overtime adjustment",
  "audit_logged": true
}
```

---

### 5. Reimbursement Management

#### List Reimbursements
```
GET /api/payroll/reimbursements/
Query Parameters:
  - organization_id (required)
  - employee_id
  - status: submitted | approved | rejected | paid
  - category: travel | meals | accommodation | office_supplies
  - from_date
  - to_date

Response:
{
  "count": 45,
  "results": [
    {
      "id": "uuid",
      "employee_id": "uuid",
      "employee_name": "John Doe",
      "category": "travel",
      "amount": 5000,
      "expense_date": "2024-07-01",
      "status": "submitted",
      "created_at": "2024-07-02T00:00:00Z"
    }
  ]
}
```

#### Approve Reimbursement
```
POST /api/payroll/reimbursements/{id}/approve/
{
  "approved_amount": 5000,
  "notes": "Approved - within policy limits"
}

Response: 200 OK
{
  "id": "uuid",
  "status": "approved",
  "approved_at": "2024-07-03T00:00:00Z",
  "approved_by": "manager@example.com",
  "notes": "Approved - within policy limits"
}
```

#### Reject Reimbursement
```
POST /api/payroll/reimbursements/{id}/reject/
{
  "reason": "Invoice not provided"
}

Response: 200 OK
```

#### Mark Reimbursement as Paid
```
POST /api/payroll/reimbursements/{id}/mark-paid/
{
  "paid_date": "2024-07-10"
}

Response: 200 OK
```

---

### 6. Loan Management

#### Create Loan
```
POST /api/payroll/loans/
{
  "employee_id": "uuid",
  "loan_type": "personal",  # personal | salary_advance | festival_advance | emergency_loan
  "principal_amount": 100000,
  "interest_rate": 8.5,
  "tenure_months": 12,
  "start_date": "2024-07-01",
  "notes": "Personal loan for home renovation"
}

Response: 201 Created
{
  "id": "uuid",
  "employee_id": "uuid",
  "loan_type": "personal",
  "principal_amount": 100000,
  "interest_rate": 8.5,
  "tenure_months": 12,
  "monthly_emi": 8791.5,
  "status": "active",
  "remaining_balance": 100000,
  "emis": [...]
}
```

#### List Loans
```
GET /api/payroll/loans/
Query Parameters:
  - organization_id (required)
  - employee_id
  - status: active | closed | default

Response:
{
  "count": 25,
  "results": [...]
}
```

#### Get Loan Details & Schedule
```
GET /api/payroll/loans/{id}/schedule/
Response:
{
  "id": "uuid",
  "principal_amount": 100000,
  "monthly_emi": 8791.5,
  "emis": [
    {
      "emi_number": 1,
      "due_date": "2024-07-31",
      "principal": 7258.5,
      "interest": 1533,
      "total": 8791.5,
      "status": "pending"
    },
    ...
  ]
}
```

#### Record EMI Payment
```
POST /api/payroll/loans/{id}/record-payment/
{
  "emi_number": 1,
  "paid_date": "2024-07-31",
  "paid_amount": 8791.5
}

Response: 200 OK
```

#### Close Loan
```
POST /api/payroll/loans/{id}/close/
{
  "settlement_date": "2024-07-31",
  "final_settlement_amount": 8791.5
}

Response: 200 OK
```

---

### 7. Reports

#### Salary Register Report
```
GET /api/payroll/reports/salary-register/
Query Parameters:
  - organization_id (required)
  - month: 7
  - year: 2024
  - format: json | csv | pdf

Response:
{
  "report_id": "uuid",
  "month": 7,
  "year": 2024,
  "total_employees": 156,
  "summary": {
    "total_gross": 11750000,
    "total_earnings": 11750000,
    "total_deductions": 1750000,
    "total_net": 10000000
  },
  "data": [
    {
      "employee_id": "uuid",
      "employee_name": "John Doe",
      "designation": "Software Engineer",
      "department": "Engineering",
      "days_worked": 30,
      "earnings": {...},
      "deductions": {...},
      "gross": 75000,
      "net": 60000
    }
  ]
}
```

#### Statutory Deductions Report
```
GET /api/payroll/reports/statutory-deductions/
Query Parameters:
  - organization_id (required)
  - month: 7
  - year: 2024

Response:
{
  "period": "July 2024",
  "summary": {
    "total_pf_employee": 187500,
    "total_pf_employer": 187500,
    "total_esi_employee": 75000,
    "total_esi_employer": 325000,
    "total_professional_tax": 31200
  },
  "breakdown": [...]
}
```

#### TDS Report
```
GET /api/payroll/reports/tds-summary/
Query Parameters:
  - organization_id (required)
  - financial_year: "2024-25"

Response:
{
  "financial_year": "2024-25",
  "reporting_period": "Apr 2024 - Mar 2025",
  "summary": {
    "total_employees": 156,
    "total_gross_income": 140000000,
    "total_tds_deducted": 14000000,
    "total_tds_paid": 13500000,
    "tds_payable": 500000
  },
  "employee_wise": [...]
}
```

#### Settlement Report
```
GET /api/payroll/reports/settlement-report/
Query Parameters:
  - organization_id (required)
  - from_date
  - to_date

Response:
{
  "period": "Jun 2024 - Jul 2024",
  "total_settlements": 5,
  "summary": {
    "total_full_final": 500000,
    "total_gratuity": 250000,
    "total_deductions": 50000,
    "total_paid": 700000
  },
  "settlements": [...]
}
```

---

### 8. Payroll Audit Trail
```
GET /api/payroll/audit-trail/
Query Parameters:
  - organization_id (required)
  - action: calculate | lock | unlock | finalize | export_bank_file
  - from_date
  - to_date
  - user_id

Response:
{
  "count": 50,
  "results": [
    {
      "id": "uuid",
      "action": "finalize",
      "payroll_cycle": "July 2024",
      "affected_payslips": 156,
      "user": "admin@example.com",
      "timestamp": "2024-07-05T10:00:00Z",
      "ip_address": "192.168.1.1",
      "details": {...}
    }
  ]
}
```

---

## EMPLOYEE ENDPOINTS

### 1. Salary Structure
```
GET /api/payroll/employee/salary-structure/
Response:
{
  "id": "uuid",
  "designation": "Software Engineer",
  "base_salary": 50000,
  "ctc": 75000,
  "effective_from": "2024-01-01",
  "components": [
    {
      "code": "DA",
      "name": "Dearness Allowance",
      "amount": 8000,
      "is_taxable": true
    }
  ],
  "breakdown": {
    "earnings": 75000,
    "deductions": 0,
    "net": 75000
  }
}
```

### 2. Payslips
```
GET /api/payroll/employee/payslips/
Query Parameters:
  - year: 2024
  - month: 7
  - limit: 12

Response:
{
  "count": 7,
  "results": [
    {
      "id": "uuid",
      "month": 7,
      "year": 2024,
      "period": "Jul 1 - Jul 31, 2024",
      "gross_salary": 75000,
      "net_salary": 60000,
      "status": "finalized",
      "generated_at": "2024-07-05T00:00:00Z"
    }
  ]
}
```

```
GET /api/payroll/employee/payslips/{id}/
Response:
{
  "id": "uuid",
  "employee": "John Doe",
  "month": 7,
  "year": 2024,
  "earnings": {
    "basic_salary": 50000,
    "dearness_allowance": 8000,
    "house_rent_allowance": 17000
  },
  "deductions": {
    "provident_fund": 6000,
    "employee_esi": 1500,
    "income_tax": 2500
  },
  "summary": {
    "gross_salary": 75000,
    "total_deductions": 15000,
    "net_salary": 60000
  },
  "statutory": {
    "pf_contribution": 6000,
    "pf_employer": 6000,
    "esi_contribution": 1500,
    "esi_employer": 6500
  },
  "days_worked": 30,
  "generated_at": "2024-07-05T00:00:00Z"
}
```

```
GET /api/payroll/employee/payslips/{id}/download/
Response: 200 OK (PDF File Download)
Content-Type: application/pdf
Content-Disposition: attachment; filename="payslip_2024_07.pdf"
```

### 3. Tax Summary
```
GET /api/payroll/employee/tax-summary/{financial_year}/
Example: /api/payroll/employee/tax-summary/2024-25/

Response:
{
  "financial_year": "2024-25",
  "reporting_period": "Apr 2024 - Mar 2025",
  "gross_income": 900000,
  "summary": {
    "pf_deduction": 72000,
    "esi_deduction": 18000,
    "professional_tax": 2000,
    "income_tax_computed": 45000,
    "tds_paid": 44000,
    "net_tax_liability": 1000
  },
  "deduction_details": [...]
}
```

### 4. Reimbursement Requests

#### Submit Reimbursement
```
POST /api/payroll/employee/reimbursements/
{
  "category": "travel",
  "amount": 5000,
  "expense_date": "2024-07-01",
  "invoice_date": "2024-07-01",
  "description": "Client visit to Mumbai - flight and accommodation",
  "invoice_file": <binary file data>
}

Response: 201 Created
```

#### List Employee Reimbursements
```
GET /api/payroll/employee/reimbursements/
Query Parameters:
  - status: submitted | approved | rejected | paid
  - limit: 20

Response:
{
  "count": 8,
  "results": [...]
}
```

#### Get Reimbursement Details
```
GET /api/payroll/employee/reimbursements/{id}/
Response: {...}
```

#### Withdraw Reimbursement (if pending)
```
DELETE /api/payroll/employee/reimbursements/{id}/
Response: 204 No Content
```

### 5. Loans
```
GET /api/payroll/employee/loans/
Response:
{
  "count": 2,
  "active_loans": [
    {
      "id": "uuid",
      "loan_type": "personal",
      "principal_amount": 100000,
      "interest_rate": 8.5,
      "monthly_emi": 8791.5,
      "remaining_balance": 50000,
      "status": "active"
    }
  ]
}
```

```
GET /api/payroll/employee/loans/{id}/schedule/
Response: {...emi schedule...}
```

### 6. Bank Account Management

#### Register/Update Bank Account
```
POST /api/payroll/employee/bank-account/
{
  "account_number": "1234567890123456",
  "ifsc_code": "HDFC0000001",
  "bank_name": "HDFC Bank",
  "branch_name": "Mumbai",
  "account_holder_name": "John Doe",
  "account_type": "savings"
}

Response: 201 Created | 200 OK (Update)
{
  "id": "uuid",
  "account_number": "****7890",
  "ifsc_code": "HDFC0000001",
  "verification_status": "unverified",
  "created_at": "2024-07-01T00:00:00Z"
}
```

#### Get Bank Account Details
```
GET /api/payroll/employee/bank-account/
Response: {...}
```

#### Verify Bank Account
```
POST /api/payroll/employee/bank-account/verify/
{
  "verification_method": "micro_deposit"
}

Response: 200 OK
{
  "verification_status": "pending",
  "message": "Micro deposits will be credited in 2-3 business days"
}
```

#### Confirm Verification
```
POST /api/payroll/employee/bank-account/confirm-verification/
{
  "micro_deposit_amounts": [10.5, 5.25]
}

Response: 200 OK
{
  "verification_status": "verified",
  "verified_at": "2024-07-05T00:00:00Z"
}
```

### 7. Settlement
```
GET /api/payroll/employee/settlement/
Response:
{
  "status": "draft | calculated | processed | paid",
  "settlement_date": "2024-07-31",
  "reason": "resignation",
  "payable": {
    "full_and_final_settlement": 250000,
    "gratuity": 100000,
    "bonus": 25000,
    "leave_encashment": 50000
  },
  "deductions": {
    "outstanding_loans": 10000,
    "pending_reimbursements": 5000
  },
  "final_amount": 410000,
  "paid_date": null
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "validation_error",
  "details": {
    "field_name": ["error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "error": "permission_denied",
  "message": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "The requested resource was not found."
}
```

### 409 Conflict
```json
{
  "error": "conflict",
  "message": "Operation cannot be completed. Payroll cycle is already locked."
}
```

### 500 Server Error
```json
{
  "error": "server_error",
  "message": "An unexpected error occurred. Please contact support."
}
```

---

## Rate Limiting

- Payroll processing endpoints: 10 requests/minute
- Report generation: 5 requests/minute
- Other endpoints: 100 requests/minute

Response Header: `X-RateLimit-Remaining: 95`

---

## Pagination

Default: 20 items per page
Max: 100 items per page

Query Parameters:
- `limit`: Items per page (default: 20)
- `offset`: Starting position (default: 0)

