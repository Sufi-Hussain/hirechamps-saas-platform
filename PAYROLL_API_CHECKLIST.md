# Payroll API Implementation Checklist

## Backend Verification (Pre-Deployment)

### Database & Models
- [ ] Run `python manage.py makemigrations` for payroll_models
- [ ] Run `python manage.py migrate` to apply migrations
- [ ] Verify all 11 models in admin: SalaryComponent, SalaryStructure, etc.
- [ ] Check constraints and unique_together fields work
- [ ] Verify JSONF fields store components correctly
- [ ] Test decimal precision (2 decimals) for salary calculations

### Viewsets & Routing
- [ ] Check `/api/payroll/salary-components/` returns 200
- [ ] Check `/api/payroll/salary-structures/` returns 200
- [ ] Check `/api/payroll/payroll-cycles/` returns 200
- [ ] Check `/api/payroll/payslips/` returns 200
- [ ] Check `/api/payroll/reimbursements/` returns 200
- [ ] Check `/api/payroll/loans/` returns 200
- [ ] Check `/api/payroll/tax-summaries/` returns 200
- [ ] Check `/api/payroll/stats/` returns dashboard stats

### Permissions & Authentication
- [ ] All endpoints require IsAuthenticated
- [ ] All viewsets inherit from TenantAwareViewSet
- [ ] Organization filtering works (user can't see other org data)
- [ ] Create operations auto-set organization
- [ ] Test with different organization users

### Custom Actions
- [ ] POST `/api/payroll/salary-components/earnings/` works
- [ ] POST `/api/payroll/salary-components/deductions/` works
- [ ] GET `/api/payroll/salary-structures/{id}/revision-history/` works
- [ ] POST `/api/payroll/salary-structures/{id}/create-revision/` works
- [ ] POST `/api/payroll/payroll-cycles/{id}/lock/` works
- [ ] POST `/api/payroll/payroll-cycles/{id}/unlock/` works
- [ ] POST `/api/payroll/payroll-cycles/{id}/process/` works
- [ ] POST `/api/payroll/reimbursements/{id}/approve/` works
- [ ] POST `/api/payroll/reimbursements/{id}/reject/` works
- [ ] GET `/api/payroll/loans/{id}/emis/` works
- [ ] POST `/api/payroll/loans/{id}/approve/` works

### Filtering & Search
- [ ] Component filtering by type: ?component_type=earning
- [ ] Component filtering by status: ?is_active=true
- [ ] Salary structure filtering by designation: ?designation_id=uuid
- [ ] Payroll cycle filtering by status: ?status=draft
- [ ] Payslip filtering by employee: ?employee_id=uuid
- [ ] Payslip filtering by month: ?month=2024-01
- [ ] Reimbursement filtering by status: ?status=submitted
- [ ] Loan filtering by status: ?status=pending

### Serializer Validation
- [ ] Create salary component - validates all fields
- [ ] Create salary structure - validates decimal fields
- [ ] Create payroll cycle - validates date ranges
- [ ] Create payslip - auto-calculates gross/net
- [ ] Create reimbursement - requires category
- [ ] Create loan - validates amount > 0
- [ ] All responses match documented schema

## Frontend Integration Points

### Dashboard (`/dashboard/payroll`)
- [ ] Stats endpoint returns: total_employees, active_cycles, monthly_payroll, pending_approvals
- [ ] Dashboard page loads without errors
- [ ] KPI cards display stats correctly
- [ ] Quick action buttons navigate correctly
- [ ] Recent activity section placeholder visible

### Payslips Page (`/dashboard/payroll/payslips`)
- [ ] List endpoint returns payslips paginated
- [ ] Table displays employee, month, gross, net
- [ ] Status badge shows correct status
- [ ] View button loads payslip details
- [ ] Download button triggers PDF endpoint
- [ ] Filters work (employee, month)

### Reimbursements Page (`/dashboard/payroll/reimbursements`)
- [ ] List endpoint returns reimbursements paginated
- [ ] Status badges show: submitted, approved, rejected, paid
- [ ] Approve button updates status to approved
- [ ] Reject button requires reason and updates status
- [ ] Reason field shows if rejected
- [ ] Filters work (status, employee)

### Salary Structures Page (`/dashboard/payroll/salary-structures`)
- [ ] List endpoint returns structures paginated
- [ ] Designation and components display
- [ ] Edit creates new revision (non-destructive)
- [ ] Revision history accessible
- [ ] Effective dates working correctly

### Payroll Cycles Page (`/dashboard/payroll/payroll-cycles`)
- [ ] List cycles with start/end dates
- [ ] Lock button works (draft → locked)
- [ ] Unlock button works (locked → draft)
- [ ] Process button generates payslips
- [ ] Status displays: draft, locked, processed

### Reports Page (`/dashboard/payroll/reports`)
- [ ] Placeholder page loads
- [ ] Navigation links working
- [ ] Ready for report implementation

## API Response Validation

### Response Format
- [ ] All endpoints return proper HTTP status codes
- [ ] Paginated responses include count, next, previous, results
- [ ] Error responses include detail message
- [ ] 400 errors include field-specific errors
- [ ] 401 returns Unauthorized for missing auth
- [ ] 403 returns Forbidden for permission denied
- [ ] 404 returns Not Found for missing resource

### Data Accuracy
- [ ] Salary calculations accurate (gross = sum of earnings - deductions)
- [ ] Tax calculations follow payroll_rules
- [ ] Decimal fields preserve 2-decimal precision
- [ ] Dates format as ISO 8601
- [ ] Monetary fields as numbers (not strings)
- [ ] Status enums respect choices

### Audit Trail
- [ ] All changes logged in PayrollAuditLog
- [ ] created_by and created_at populated
- [ ] updated_by and updated_at populated for updates
- [ ] Previous values stored in changes field

## Performance Testing

### Query Optimization
- [ ] Salary structure list doesn't N+1 query
- [ ] Payslip list doesn't N+1 query components
- [ ] Reimbursement list loads < 500ms
- [ ] Dashboard stats endpoint < 200ms
- [ ] Large datasets (1000+ records) paginate correctly

### Caching
- [ ] Salary components cacheable (rarely change)
- [ ] Payroll rules cacheable (rarely change)
- [ ] Payslips cached by month/employee
- [ ] Tax summaries cached annually

## Security Testing

### Multi-tenant Isolation
- [ ] User A can't access organization B's data
- [ ] Salary structures filtered by org correctly
- [ ] Payslips filtered by org correctly
- [ ] Reimbursements filtered by org correctly
- [ ] Loans filtered by org correctly

### Permission Enforcement
- [ ] Only payroll_manager can create salary structures
- [ ] Only payroll_manager can process payroll
- [ ] Only hr_manager can approve reimbursements
- [ ] Employees can only see own payslips
- [ ] Employees can only submit own reimbursements

### Data Validation
- [ ] Negative salary components rejected
- [ ] Invalid component types rejected
- [ ] Date ranges validated (start <= end)
- [ ] Decimal precision validated
- [ ] Required fields enforced

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No pending migrations
- [ ] All endpoints tested in staging
- [ ] Performance benchmarks met
- [ ] Security audit complete

### Deployment
- [ ] Database migrations run on production
- [ ] Payroll models available in admin
- [ ] API endpoints accessible
- [ ] Frontend builds successfully
- [ ] No errors in server logs

### Post-Deployment
- [ ] Smoke test all endpoints
- [ ] Verify data accuracy in production
- [ ] Monitor API response times
- [ ] Check error rates
- [ ] Verify audit logs working

## Troubleshooting

### Common Issues

**Issue: 404 on payroll endpoints**
- Solution: Check urls.py imports, restart server, verify router registration

**Issue: 403 Forbidden on all payroll endpoints**
- Solution: Verify IsAuthenticated permission, check user token, verify organization set

**Issue: Salary calculations wrong**
- Solution: Check payroll_rules, verify component amounts, check calculation_method

**Issue: Reimbursements not appearing**
- Solution: Check organization filter, verify user has permission, check submission status

**Issue: Performance slow**
- Solution: Check database indexes, add select_related, implement caching

## Next Steps

1. Run migrations: `python manage.py migrate`
2. Create test data: `python manage.py seed_demo_data`
3. Test endpoints with Postman/curl
4. Integrate frontend components
5. Configure permissions
6. Deploy to staging
7. Run full test suite
8. Deploy to production
