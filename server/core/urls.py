from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizationViewSet, UserViewSet, DepartmentViewSet, DesignationViewSet,
    EmployeeViewSet, LeaveTypeViewSet, LeaveBalanceViewSet, LeaveRequestViewSet,
    AttendanceViewSet, SalaryStructureViewSet, SalarySlipViewSet, PayrollRuleViewSet,
    JobPostingViewSet, CandidateViewSet, TrainingProgramViewSet, TrainingEnrollmentViewSet
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

urlpatterns = [
    path('', include(router.urls)),
]
