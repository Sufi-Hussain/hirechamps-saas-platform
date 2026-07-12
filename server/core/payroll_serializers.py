from rest_framework import serializers
from .payroll_models import (
    SalaryComponent, SalaryStructure, SalaryStructureComponent,
    SalaryRevision, BankAccount, PayrollCycle, Payslip,
    Reimbursement, Loan, LoanEMI, TaxSummary, Settlement, PayrollAuditLog
)


class SalaryComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryComponent
        fields = ['id', 'name', 'code', 'component_type', 'calculation_method',
                  'percentage', 'fixed_amount', 'is_active', 'is_taxable', 'is_statutory']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SalaryStructureComponentSerializer(serializers.ModelSerializer):
    component_name = serializers.CharField(source='component.name', read_only=True)
    component_code = serializers.CharField(source='component.code', read_only=True)

    class Meta:
        model = SalaryStructureComponent
        fields = ['id', 'component', 'component_name', 'component_code', 'amount']


class SalaryStructureSerializer(serializers.ModelSerializer):
    components = SalaryStructureComponentSerializer(
        source='salarystructurecomponent_set', many=True, read_only=True
    )
    designation_name = serializers.CharField(source='designation.name', read_only=True)

    class Meta:
        model = SalaryStructure
        fields = ['id', 'designation', 'designation_name', 'base_salary', 'ctc',
                  'effective_from', 'effective_to', 'components']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SalaryRevisionSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    employee_email = serializers.CharField(source='employee.user.email', read_only=True)

    class Meta:
        model = SalaryRevision
        fields = ['id', 'employee', 'employee_name', 'employee_email',
                  'effective_from', 'effective_to', 'base_salary', 'ctc',
                  'components', 'reason']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BankAccountSerializer(serializers.ModelSerializer):
    employee_email = serializers.CharField(source='employee.user.email', read_only=True)

    class Meta:
        model = BankAccount
        fields = ['id', 'employee', 'employee_email', 'account_number', 'ifsc_code',
                  'bank_name', 'branch_name', 'account_holder_name', 'account_type',
                  'verification_status', 'is_active']
        read_only_fields = ['id', 'verification_status', 'verified_at']
        extra_kwargs = {
            'account_number': {'write_only': True},
        }


class PayrollCycleSerializer(serializers.ModelSerializer):
    released_by_name = serializers.CharField(source='released_by.get_full_name', read_only=True)

    class Meta:
        model = PayrollCycle
        fields = ['id', 'month', 'year', 'status', 'start_date', 'end_date',
                  'salary_due_date', 'total_employees', 'processed_employees',
                  'released_by', 'released_by_name', 'released_at']
        read_only_fields = ['id', 'released_at', 'processed_employees']


class PayslipSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    employee_email = serializers.CharField(source='employee.user.email', read_only=True)
    payroll_month = serializers.SerializerMethodField()

    class Meta:
        model = Payslip
        fields = ['id', 'payroll_cycle', 'employee', 'employee_name', 'employee_email',
                  'payroll_month', 'status', 'base_salary', 'earnings', 'deductions',
                  'gross_salary', 'total_deductions', 'net_salary', 'tax_amount',
                  'pf_contribution', 'days_worked', 'working_days', 'leave_days']
        read_only_fields = ['id', 'gross_salary', 'total_deductions', 'net_salary']

    def get_payroll_month(self, obj):
        return f"{obj.payroll_cycle.month}/{obj.payroll_cycle.year}"


class ReimbursementSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)

    class Meta:
        model = Reimbursement
        fields = ['id', 'employee', 'employee_name', 'category', 'amount',
                  'description', 'receipt_file', 'status', 'submitted_date',
                  'approved_by', 'approved_by_name', 'approved_date', 'approval_comments']
        read_only_fields = ['id', 'submitted_date']


class LoanEMISerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanEMI
        fields = ['id', 'emi_number', 'due_date', 'emi_amount', 'principal',
                  'interest', 'status', 'paid_date', 'paid_amount']
        read_only_fields = ['id', 'principal', 'interest']


class LoanSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    emis = LoanEMISerializer(many=True, read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)

    class Meta:
        model = Loan
        fields = ['id', 'employee', 'employee_name', 'loan_type', 'amount',
                  'interest_rate', 'tenure_months', 'emi_amount', 'status',
                  'disbursement_date', 'approved_by', 'approved_by_name',
                  'remaining_amount', 'emis']
        read_only_fields = ['id', 'remaining_amount', 'emis']


class TaxSummarySerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)

    class Meta:
        model = TaxSummary
        fields = ['id', 'employee', 'employee_name', 'financial_year_start',
                  'financial_year_end', 'gross_salary', 'standard_deduction',
                  'tax_deducted', 'pf_contribution', 'taxable_income']
        read_only_fields = ['id']


class SettlementSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)

    class Meta:
        model = Settlement
        fields = ['id', 'employee', 'employee_name', 'exit_date',
                  'gratuity_amount', 'leave_encashment', 'pending_salary',
                  'pending_reimbursement', 'total_payable', 'total_deductions',
                  'net_settlement', 'processed', 'processed_date']
        read_only_fields = ['id', 'total_payable', 'net_settlement']


class PayrollAuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = PayrollAuditLog
        fields = ['id', 'action_type', 'user', 'user_name', 'entity_type',
                  'entity_id', 'old_values', 'new_values', 'change_summary',
                  'ip_address', 'created_at']
        read_only_fields = ['id', 'created_at']
