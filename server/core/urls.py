from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizationViewSet, UserViewSet, DepartmentViewSet, DesignationViewSet,
    EmployeeViewSet, LeaveTypeViewSet, LeaveBalanceViewSet, LeaveRequestViewSet,
    AttendanceViewSet, SalaryStructureViewSet, SalarySlipViewSet, PayrollRuleViewSet,
    JobPostingViewSet, CandidateViewSet, TrainingProgramViewSet, TrainingEnrollmentViewSet,
    AuditLogViewSet
)
from .auth_views import login, logout, change_password, get_current_user, verify_invite, set_password
from .account_views import register_company, invite_employee, create_hr_user, get_user_organizations
from .navigation_views import get_navigation_menu
from .dashboard_views import dashboard_hr
from .payroll_views import (
    SalaryComponentViewSet, SalaryStructureViewSet, PayrollCycleViewSet,
    PayslipViewSet, ReimbursementViewSet, LoanViewSet, TaxSummaryViewSet,
    PayrollStatsView
)

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'users', UserViewSet, basename='user')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'designations', DesignationViewSet, basename='designation')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'leave-types', LeaveTypeViewSet, basename='leave-type')
router.register(r'leave-balances', LeaveBalanceViewSet, basename='leave-balance')
router.register(r'leave-requests', LeaveRequestViewSet, basename='leave-request')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'salary-structures', SalaryStructureViewSet, basename='salary-structure')
router.register(r'salary-slips', SalarySlipViewSet, basename='salary-slip')
router.register(r'payroll-rules', PayrollRuleViewSet, basename='payroll-rule')
router.register(r'job-postings', JobPostingViewSet, basename='job-posting')
router.register(r'candidates', CandidateViewSet, basename='candidate')
router.register(r'training-programs', TrainingProgramViewSet, basename='training-program')
router.register(r'training-enrollments', TrainingEnrollmentViewSet, basename='training-enrollment')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-log')
router.register(r'payroll/salary-components', SalaryComponentViewSet, basename='salary-component')
router.register(r'payroll/salary-structures', SalaryStructureViewSet, basename='payroll-salary-structure')
router.register(r'payroll/payroll-cycles', PayrollCycleViewSet, basename='payroll-cycle')
router.register(r'payroll/payslips', PayslipViewSet, basename='payslip')
router.register(r'payroll/reimbursements', ReimbursementViewSet, basename='reimbursement')
router.register(r'payroll/loans', LoanViewSet, basename='loan')
router.register(r'payroll/tax-summaries', TaxSummaryViewSet, basename='tax-summary')

urlpatterns = [
    path('auth/login/', login, name='login'),
    path('auth/logout/', logout, name='logout'),
    path('auth/change-password/', change_password, name='change-password'),
    path('auth/me/', get_current_user, name='get-current-user'),
    path('auth/register-company/', register_company, name='register-company'),
    path('auth/verify-invite/', verify_invite, name='verify-invite'),
    path('auth/set-password/', set_password, name='set-password'),
    path('accounts/invite-employee/', invite_employee, name='invite-employee'),
    path('accounts/create-hr-user/', create_hr_user, name='create-hr-user'),
    path('accounts/my-organizations/', get_user_organizations, name='my-organizations'),
    path('navigation/menu/', get_navigation_menu, name='navigation-menu'),
    path('dashboard/hr/', dashboard_hr, name='dashboard-hr'),
    path('payroll/stats/', PayrollStatsView.as_view({'get': 'stats'}), name='payroll-stats'),
    path('', include(router.urls)),
]
