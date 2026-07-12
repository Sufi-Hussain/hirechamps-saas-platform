# Payroll API - Quick Reference

## Base URL
```
http://localhost:8000/api
```

## Authentication
All requests require Bearer token in header:
```
Authorization: Bearer {access_token}
```

## Salary Components

### List Components
```
GET /payroll/salary-components/
?component_type=earning&is_active=true
```

### Create Component
```
POST /payroll/salary-components/
{
  "name": "House Rent Allowance",
  "code": "HRA",
  "component_type": "earning",
  "calculation_method": "percentage",
  "percentage": 40.0,
  "is_taxable": true
}
```

### Get Earnings Only
```
GET /payroll/salary-components/earnings/
```

### Get Deductions Only
```
GET /payroll/salary-components/deductions/
```

## Salary Structures

### List Structures
```
GET /payroll/salary-structures/
?designation_id={uuid}&is_active=true
```

### Create Structure
```
POST /payroll/salary-structures/
{
  "designation_id": "{uuid}",
  "base_salary": 50000,
  "ctc": 75000,
  "components": [
    {"component_id": "{uuid}", "amount": 8000}
  ],
  "effective_from": "2024-01-01"
}
```

### Get Revision History
```
GET /payroll/salary-structures/{id}/revision-history/
```

### Create Revision
```
POST /payroll/salary-structures/{id}/create-revision/
{
  "base_salary": 52000,
  "ctc": 78000,
  "components": [...],
  "effective_from": "2024-07-01"
}
```

## Payroll Cycles

### List Cycles
```
GET /payroll/payroll-cycles/
?status=draft
```

### Create Cycle
```
POST /payroll/payroll-cycles/
{
  "name": "January 2024",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "cutoff_date": "2024-01-25"
}
```

### Lock Cycle
```
POST /payroll/payroll-cycles/{id}/lock/
```

### Unlock Cycle
```
POST /payroll/payroll-cycles/{id}/unlock/
```

### Process Payroll
```
POST /payroll/payroll-cycles/{id}/process/
```

## Payslips

### List Payslips
```
GET /payslips/
?employee_id={uuid}&month=2024-01
```

### Get Payslip Details
```
GET /payslips/{id}/details/
```

### Download Payslip PDF
```
GET /payslips/{id}/download/
```

## Reimbursements

### List Reimbursements
```
GET /payroll/reimbursements/
?status=submitted&employee_id={uuid}
```

### Submit Reimbursement
```
POST /payroll/reimbursements/
{
  "employee_id": "{uuid}",
  "category": "travel",
  "description": "Business trip to Delhi",
  "amount": 5000,
  "receipt_url": "..."
}
```

### Approve Reimbursement
```
POST /payroll/reimbursements/{id}/approve/
```

### Reject Reimbursement
```
POST /payroll/reimbursements/{id}/reject/
{
  "reason": "Receipt not attached"
}
```

## Loans

### List Loans
```
GET /payroll/loans/
?employee_id={uuid}&status=pending
```

### Apply for Loan
```
POST /payroll/loans/
{
  "employee_id": "{uuid}",
  "loan_type": "personal",
  "amount": 100000,
  "tenure_months": 12,
  "reason": "Home renovation"
}
```

### Get Loan EMIs
```
GET /payroll/loans/{id}/emis/
```

### Approve Loan
```
POST /payroll/loans/{id}/approve/
```

## Tax Summaries

### Get Tax Summary
```
GET /payroll/tax-summaries/
?employee_id={uuid}&financial_year=2023-24
```

## Dashboard Stats

### Get Payroll Statistics
```
GET /payroll/stats/
```

Response:
```json
{
  "total_employees": 150,
  "active_cycles": 1,
  "monthly_payroll": 2500000,
  "pending_approvals": 5
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Bad request",
  "errors": {
    "name": ["This field may not be blank."],
    "amount": ["Ensure this value is greater than 0."]
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

## Status Codes
- 200: Success
- 201: Created
- 204: No Content (deleted)
- 400: Bad Request (validation error)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (no permission)
- 404: Not Found
- 500: Server Error

## Pagination
Paginated endpoints include:
```json
{
  "count": 150,
  "next": "?page=2",
  "previous": null,
  "results": [...]
}
```

Query parameters:
- `page`: Page number (default 1)
- `page_size`: Items per page (default 20)

## Filtering
- Search: `?search=engineer`
- Order: `?ordering=-created_at`
- Filter: `?status=active`

## Rate Limiting
- 1000 requests per hour per user
- 429 Too Many Requests if exceeded

## Timestamps
All dates in ISO 8601 format:
- `2024-01-15T10:30:00Z`

## Decimal Precision
All currency fields have 2 decimal places:
- `5000.00`, `12345.50`
