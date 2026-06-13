from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q

from .models import (
    Organization, User, Department, Designation, Employee, LeaveType,
    LeaveBalance, LeaveRequest, Attendance, SalaryStructure, SalarySlip,
    PayrollRule, JobPosting, Candidate, TrainingProgram, TrainingEnrollment,
    AuditLog
)
from .serializers import (
    OrganizationSerializer, UserSerializer, UserDetailSerializer,
    DepartmentSerializer, DesignationSerializer, EmployeeSerializer,
    LeaveTypeSerializer, LeaveBalanceSerializer, LeaveRequestSerializer,
    AttendanceSerializer, SalaryStructureSerializer, SalarySlipSerializer,
    PayrollRuleSerializer, JobPostingSerializer, CandidateSerializer,
    TrainingProgramSerializer, TrainingEnrollmentSerializer, AuditLogSerializer
)
from .middleware import get_current_organization
from .permissions import IsAuditViewer


class TenantAwareViewSet(viewsets.ModelViewSet):
    """Base viewset that filters by current organization"""
    
    def get_queryset(self):
        """Filter queryset by current user's organization"""
        org = get_current_organization()
        if not org and hasattr(self.request.user, 'organization'):
            org = self.request.user.organization
        
        qs = super().get_queryset()
        
        # Filter by organization field if it exists
        if hasattr(qs.model, 'organization'):
            qs = qs.filter(organization=org)
        
        return qs

    def perform_create(self, serializer):
        """Auto-set organization to current user's organization"""
        org = get_current_organization()
        if not org and hasattr(self.request.user, 'organization'):
            org = self.request.user.organization
        
        if hasattr(serializer.Meta.model, 'organization'):
            serializer.save(organization=org)
        else:
            serializer.save()


class OrganizationViewSet(TenantAwareViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']


class UserViewSet(TenantAwareViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserDetailSerializer
        return UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)


class DepartmentViewSet(TenantAwareViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']


class DesignationViewSet(TenantAwareViewSet):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['level', 'name']
    ordering = ['level', 'name']


class EmployeeViewSet(TenantAwareViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee_id', 'user__email', 'user__first_name', 'user__last_name']
    ordering_fields = ['date_of_joining', 'employee_id']
    ordering = ['-date_of_joining']

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active employees"""
        queryset = self.get_queryset().filter(employment_status='active')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update employee employment status"""
        employee = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Employee.EMPLOYMENT_STATUS_CHOICES):
            employee.employment_status = new_status
            employee.save()
            return Response({'status': 'success', 'message': f'Employee status updated to {new_status}'})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)


class LeaveTypeViewSet(TenantAwareViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class LeaveBalanceViewSet(TenantAwareViewSet):
    queryset = LeaveBalance.objects.all()
    serializer_class = LeaveBalanceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_balance(self, request):
        """Get current user's leave balance"""
        try:
            employee = request.user.employee_profile
            year = request.query_params.get('year', timezone.now().year)
            balances = employee.leave_balances.filter(year=year)
            serializer = self.get_serializer(balances, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee profile not found'}, status=status.HTTP_404_NOT_FOUND)


class LeaveRequestViewSet(TenantAwareViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__employee_id', 'reason']
    ordering_fields = ['start_date']
    ordering = ['-start_date']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a leave request"""
        leave_request = self.get_object()
        if leave_request.status != 'pending':
            return Response({'error': 'Only pending requests can be approved'}, status=status.HTTP_400_BAD_REQUEST)
        
        leave_request.status = 'approved'
        leave_request.approved_by = request.user
        leave_request.approval_date = timezone.now()
        leave_request.save()
        
        return Response({'status': 'success', 'message': 'Leave request approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a leave request"""
        leave_request = self.get_object()
        if leave_request.status != 'pending':
            return Response({'error': 'Only pending requests can be rejected'}, status=status.HTTP_400_BAD_REQUEST)
        
        leave_request.status = 'rejected'
        leave_request.rejection_reason = request.data.get('reason', '')
        leave_request.save()
        
        return Response({'status': 'success', 'message': 'Leave request rejected'})


class AttendanceViewSet(TenantAwareViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__employee_id']
    ordering_fields = ['date']
    ordering = ['-date']

    @action(detail=False, methods=['post'])
    def bulk_import(self, request):
        """Bulk import attendance records"""
        records = request.data.get('records', [])
        created_count = 0
        
        for record in records:
            obj, created = Attendance.objects.update_or_create(
                employee_id=record.get('employee_id'),
                date=record.get('date'),
                defaults={
                    'status': record.get('status'),
                    'check_in_time': record.get('check_in_time'),
                    'check_out_time': record.get('check_out_time'),
                    'hours_worked': record.get('hours_worked', 0),
                }
            )
            if created:
                created_count += 1
        
        return Response({'status': 'success', 'records_created': created_count})


class SalaryStructureViewSet(TenantAwareViewSet):
    queryset = SalaryStructure.objects.all()
    serializer_class = SalaryStructureSerializer
    permission_classes = [IsAuthenticated]


class SalarySlipViewSet(TenantAwareViewSet):
    queryset = SalarySlip.objects.all()
    serializer_class = SalarySlipSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__employee_id']
    ordering_fields = ['year', 'month']
    ordering = ['-year', '-month']

    @action(detail=False, methods=['get'])
    def my_slips(self, request):
        """Get current user's salary slips"""
        try:
            employee = request.user.employee_profile
            slips = employee.salary_slips.all()
            serializer = self.get_serializer(slips, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee profile not found'}, status=status.HTTP_404_NOT_FOUND)


class PayrollRuleViewSet(TenantAwareViewSet):
    queryset = PayrollRule.objects.all()
    serializer_class = PayrollRuleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'rule_type']
    ordering_fields = ['version', 'effective_from']
    ordering = ['-version']


class JobPostingViewSet(TenantAwareViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['posted_on']
    ordering = ['-posted_on']

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active job postings"""
        queryset = self.get_queryset().filter(status='published')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CandidateViewSet(TenantAwareViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'job_posting__title']
    ordering_fields = ['applied_on', 'status']
    ordering = ['-applied_on']

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        """Update candidate status"""
        candidate = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Candidate.STATUS_CHOICES):
            candidate.status = new_status
            candidate.save()
            return Response({'status': 'success', 'message': f'Candidate status updated to {new_status}'})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)


class TrainingProgramViewSet(TenantAwareViewSet):
    queryset = TrainingProgram.objects.all()
    serializer_class = TrainingProgramSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['start_date']
    ordering = ['-start_date']


class TrainingEnrollmentViewSet(TenantAwareViewSet):
    queryset = TrainingEnrollment.objects.all()
    serializer_class = TrainingEnrollmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['employee__employee_id', 'training_program__name']

    @action(detail=False, methods=['get'])
    def my_enrollments(self, request):
        """Get current user's training enrollments"""
        try:
            employee = request.user.employee_profile
            enrollments = employee.training_enrollments.all()
            serializer = self.get_serializer(enrollments, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee profile not found'}, status=status.HTTP_404_NOT_FOUND)


class AuditLogViewSet(TenantAwareViewSet):
    """Audit log viewset - read-only with permission checks"""
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsAuditViewer]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__email', 'action', 'resource_type', 'description']
    ordering_fields = ['timestamp', 'action']
    ordering = ['-timestamp']

    def create(self, request, *args, **kwargs):
        """Prevent direct creation of audit logs"""
        return Response({'error': 'Audit logs are auto-generated'}, status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        """Prevent modification of audit logs"""
        return Response({'error': 'Audit logs cannot be modified'}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        """Prevent deletion of audit logs"""
        return Response({'error': 'Audit logs cannot be deleted'}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['get'])
    def my_actions(self, request):
        """Get audit logs for current user's actions"""
        logs = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)
