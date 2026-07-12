from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Sum, F, Q
from decimal import Decimal

from .payroll_models import (
    SalaryComponent, SalaryStructure, SalaryStructureComponent,
    SalaryRevision, BankAccount, PayrollCycle, Payslip, PayslipComponent,
    Reimbursement, Loan, LoanEMI, TaxSummary, Settlement, PayrollAuditLog
)
from .payroll_serializers import (
    SalaryComponentSerializer, SalaryStructureSerializer,
    SalaryStructureComponentSerializer, SalaryRevisionSerializer,
    BankAccountSerializer, PayrollCycleSerializer, PayslipSerializer,
    PayslipComponentSerializer, ReimbursementSerializer, LoanSerializer,
    LoanEMISerializer, TaxSummarySerializer, SettlementSerializer,
    PayrollAuditLogSerializer
)
from .views import TenantAwareViewSet
from .middleware import get_current_organization


class SalaryComponentViewSet(TenantAwareViewSet):
    """Manage salary components (earnings, deductions)"""
    queryset = SalaryComponent.objects.all()
    serializer_class = SalaryComponentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['order', 'created_at']
    ordering = ['order']

    def get_queryset(self):
        qs = super().get_queryset()
        component_type = self.request.query_params.get('component_type')
        is_active = self.request.query_params.get('is_active')
        
        if component_type:
            qs = qs.filter(component_type=component_type)
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        
        return qs

    @action(detail=False, methods=['get'])
    def earnings(self, request):
        """Get all earning components"""
        components = self.get_queryset().filter(component_type='earning')
        serializer = self.get_serializer(components, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def deductions(self, request):
        """Get all deduction components"""
        components = self.get_queryset().filter(component_type='deduction')
        serializer = self.get_serializer(components, many=True)
        return Response(serializer.data)


class SalaryStructureViewSet(TenantAwareViewSet):
    """Manage salary structures for designations"""
    queryset = SalaryStructure.objects.all()
    serializer_class = SalaryStructureSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['designation__name']
    ordering_fields = ['effective_from', 'created_at']
    ordering = ['-effective_from']

    def get_queryset(self):
        qs = super().get_queryset()
        designation_id = self.request.query_params.get('designation_id')
        is_active = self.request.query_params.get('is_active')
        
        if designation_id:
            qs = qs.filter(designation_id=designation_id)
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        
        return qs

    @action(detail=True, methods=['get'])
    def revision_history(self, request, pk=None):
        """Get all revisions for a salary structure"""
        structure = self.get_object()
        revisions = structure.revisions.all()
        serializer = SalaryRevisionSerializer(revisions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def create_revision(self, request, pk=None):
        """Create a new salary revision"""
        structure = self.get_object()
        serializer = SalaryRevisionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(salary_structure=structure, created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PayrollCycleViewSet(TenantAwareViewSet):
    """Manage payroll cycles (monthly, bi-weekly, etc.)"""
    queryset = PayrollCycle.objects.all()
    serializer_class = PayrollCycleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['start_date', 'created_at']
    ordering = ['-start_date']

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        
        if status_filter:
            qs = qs.filter(status=status_filter)
        
        return qs

    @action(detail=True, methods=['post'])
    def lock(self, request, pk=None):
        """Lock payroll cycle to prevent further changes"""
        cycle = self.get_object()
        if cycle.status != 'draft':
            return Response(
                {'error': 'Only draft cycles can be locked'},
                status=status.HTTP_400_BAD_REQUEST
            )
        cycle.status = 'locked'
        cycle.save()
        return Response({'status': 'Payroll cycle locked'})

    @action(detail=True, methods=['post'])
    def unlock(self, request, pk=None):
        """Unlock payroll cycle for editing"""
        cycle = self.get_object()
        cycle.status = 'draft'
        cycle.save()
        return Response({'status': 'Payroll cycle unlocked'})

    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        """Process payroll cycle and generate payslips"""
        cycle = self.get_object()
        if cycle.status == 'processed':
            return Response(
                {'error': 'Cycle already processed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # This would trigger the payroll processing logic
        cycle.status = 'processed'
        cycle.save()
        
        return Response({
            'status': 'Payroll cycle processed',
            'cycle_id': str(cycle.id)
        })


class PayslipViewSet(TenantAwareViewSet):
    """View and manage payslips"""
    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['month', 'created_at']
    ordering = ['-month']

    def get_queryset(self):
        qs = super().get_queryset()
        employee_id = self.request.query_params.get('employee_id')
        month = self.request.query_params.get('month')
        
        if employee_id:
            qs = qs.filter(employee_id=employee_id)
        if month:
            qs = qs.filter(month=month)
        
        return qs

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download payslip as PDF"""
        payslip = self.get_object()
        # PDF generation would be implemented here
        return Response({'url': f'/payslips/{pk}/pdf'})

    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        """Get detailed payslip breakdown"""
        payslip = self.get_object()
        serializer = self.get_serializer(payslip)
        return Response(serializer.data)


class ReimbursementViewSet(TenantAwareViewSet):
    """Manage reimbursement requests"""
    queryset = Reimbursement.objects.all()
    serializer_class = ReimbursementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['submitted_date', 'created_at']
    ordering = ['-submitted_date']

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        employee_id = self.request.query_params.get('employee_id')
        
        if status_filter:
            qs = qs.filter(status=status_filter)
        if employee_id:
            qs = qs.filter(employee_id=employee_id)
        
        return qs

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve reimbursement request"""
        reimbursement = self.get_object()
        if reimbursement.status != 'submitted':
            return Response(
                {'error': 'Only submitted requests can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reimbursement.status = 'approved'
        reimbursement.approved_by = request.user
        reimbursement.save()
        
        return Response({'status': 'Reimbursement approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject reimbursement request"""
        reimbursement = self.get_object()
        reason = request.data.get('reason', '')
        
        if reimbursement.status != 'submitted':
            return Response(
                {'error': 'Only submitted requests can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reimbursement.status = 'rejected'
        reimbursement.rejected_reason = reason
        reimbursement.save()
        
        return Response({'status': 'Reimbursement rejected'})


class LoanViewSet(TenantAwareViewSet):
    """Manage employee loans"""
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['application_date', 'created_at']
    ordering = ['-application_date']

    def get_queryset(self):
        qs = super().get_queryset()
        employee_id = self.request.query_params.get('employee_id')
        status_filter = self.request.query_params.get('status')
        
        if employee_id:
            qs = qs.filter(employee_id=employee_id)
        if status_filter:
            qs = qs.filter(status=status_filter)
        
        return qs

    @action(detail=True, methods=['get'])
    def emis(self, request, pk=None):
        """Get all EMIs for a loan"""
        loan = self.get_object()
        emis = loan.emis.all()
        serializer = LoanEMISerializer(emis, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve loan application"""
        loan = self.get_object()
        if loan.status != 'pending':
            return Response(
                {'error': 'Only pending loans can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        loan.status = 'approved'
        loan.approved_by = request.user
        loan.save()
        
        return Response({'status': 'Loan approved'})


class TaxSummaryViewSet(TenantAwareViewSet):
    """View tax summaries for employees"""
    queryset = TaxSummary.objects.all()
    serializer_class = TaxSummarySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['financial_year', 'created_at']
    ordering = ['-financial_year']

    def get_queryset(self):
        qs = super().get_queryset()
        employee_id = self.request.query_params.get('employee_id')
        financial_year = self.request.query_params.get('financial_year')
        
        if employee_id:
            qs = qs.filter(employee_id=employee_id)
        if financial_year:
            qs = qs.filter(financial_year=financial_year)
        
        return qs


class PayrollStatsView(TenantAwareViewSet):
    """Payroll statistics and metrics"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get payroll statistics"""
        org = get_current_organization()
        if not org:
            org = request.user.organization
        
        from .models import Employee
        
        total_employees = Employee.objects.filter(organization=org).count()
        active_cycles = PayrollCycle.objects.filter(
            organization=org,
            status__in=['draft', 'processed']
        ).count()
        
        monthly_payroll = Payslip.objects.filter(
            organization=org
        ).aggregate(total=Sum('net_pay'))['total'] or Decimal('0')
        
        pending_approvals = Reimbursement.objects.filter(
            organization=org,
            status='submitted'
        ).count()
        
        return Response({
            'total_employees': total_employees,
            'active_cycles': active_cycles,
            'monthly_payroll': float(monthly_payroll),
            'pending_approvals': pending_approvals
        })
