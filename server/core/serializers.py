from rest_framework import serializers
from .models import (
    Organization, User, Department, Designation, Employee, LeaveType,
    LeaveBalance, LeaveRequest, Attendance, SalaryStructure, SalarySlip,
    PayrollRule, JobPosting, Candidate, TrainingProgram, TrainingEnrollment
)


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'slug', 'email', 'phone', 'website', 'industry',
                  'country', 'state', 'city', 'subscription_tier', 'subscription_status',
                  'employees_count', 'max_employees', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'organization', 'organization_name',
                  'role', 'phone', 'date_of_birth', 'is_verified', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserDetailSerializer(UserSerializer):
    class Meta:
        model = User
        fields = UserSerializer.Meta.fields + ['last_login_at', 'profile_image_url']


class DepartmentSerializer(serializers.ModelSerializer):
    head_name = serializers.CharField(source='head.get_full_name', read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'organization', 'name', 'description', 'head', 'head_name', 
                  'budget', 'location', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = ['id', 'organization', 'name', 'description', 'base_salary', 'level', 'created_at']
        read_only_fields = ['id', 'created_at']


class EmployeeSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    designation_name = serializers.CharField(source='designation.name', read_only=True)
    manager_name = serializers.CharField(source='manager.user.get_full_name', read_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'organization', 'user', 'user_email', 'user_name', 'employee_id',
                  'department', 'department_name', 'designation', 'designation_name',
                  'manager', 'manager_name', 'employment_type', 'employment_status',
                  'date_of_joining', 'date_of_termination', 'pan_number', 'aadhar_number',
                  'bank_account_number', 'bank_ifsc_code', 'emergency_contact_name',
                  'emergency_contact_phone', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = ['id', 'organization', 'name', 'description', 'annual_limit', 'is_paid',
                  'requires_approval', 'carryforward_allowed', 'max_carryforward']
        read_only_fields = ['id']


class LeaveBalanceSerializer(serializers.ModelSerializer):
    leave_type_name = serializers.CharField(source='leave_type.name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)

    class Meta:
        model = LeaveBalance
        fields = ['id', 'employee', 'employee_id', 'leave_type', 'leave_type_name',
                  'balance', 'used', 'carryforward', 'year']
        read_only_fields = ['id']


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    leave_type_name = serializers.CharField(source='leave_type.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)

    class Meta:
        model = LeaveRequest
        fields = ['id', 'employee', 'employee_id', 'leave_type', 'leave_type_name',
                  'start_date', 'end_date', 'number_of_days', 'reason', 'status',
                  'approved_by', 'approved_by_name', 'approval_date', 'rejection_reason',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AttendanceSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_id', 'date', 'status', 'check_in_time',
                  'check_out_time', 'hours_worked', 'remarks', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SalaryStructureSerializer(serializers.ModelSerializer):
    designation_name = serializers.CharField(source='designation.name', read_only=True)

    class Meta:
        model = SalaryStructure
        fields = ['id', 'designation', 'designation_name', 'base_salary', 'dearness_allowance',
                  'house_rent_allowance', 'other_allowances', 'effective_from', 'effective_to']
        read_only_fields = ['id']


class SalarySlipSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)

    class Meta:
        model = SalarySlip
        fields = ['id', 'employee', 'employee_id', 'employee_name', 'month', 'year',
                  'gross_salary', 'deductions', 'net_salary', 'status', 'pay_date',
                  'generated_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'generated_at', 'created_at', 'updated_at']


class PayrollRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollRule
        fields = ['id', 'organization', 'name', 'rule_type', 'version', 'effective_from',
                  'effective_to', 'configuration', 'created_at']
        read_only_fields = ['id', 'created_at']


class JobPostingSerializer(serializers.ModelSerializer):
    designation_name = serializers.CharField(source='designation.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = JobPosting
        fields = ['id', 'organization', 'title', 'description', 'department', 'department_name',
                  'designation', 'designation_name', 'experience_required', 'status', 'openings',
                  'posted_on', 'closed_on', 'published_by', 'created_at']
        read_only_fields = ['id', 'posted_on', 'created_at']


class CandidateSerializer(serializers.ModelSerializer):
    job_posting_title = serializers.CharField(source='job_posting.title', read_only=True)
    assigned_recruiter_name = serializers.CharField(source='assigned_recruiter.get_full_name', read_only=True)

    class Meta:
        model = Candidate
        fields = ['id', 'organization', 'job_posting', 'job_posting_title', 'first_name',
                  'last_name', 'email', 'phone', 'resume_url', 'cover_letter', 'status',
                  'current_location', 'expected_salary', 'notice_period_days', 'applied_on',
                  'assigned_recruiter', 'assigned_recruiter_name', 'hired_employee']
        read_only_fields = ['id', 'applied_on']


class TrainingProgramSerializer(serializers.ModelSerializer):
    enrollments_count = serializers.SerializerMethodField()

    class Meta:
        model = TrainingProgram
        fields = ['id', 'organization', 'name', 'description', 'start_date', 'end_date',
                  'duration_hours', 'trainer_name', 'trainer_email', 'location', 'capacity',
                  'budget', 'enrollments_count', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_enrollments_count(self, obj):
        return obj.enrollments.count()


class TrainingEnrollmentSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    program_name = serializers.CharField(source='training_program.name', read_only=True)

    class Meta:
        model = TrainingEnrollment
        fields = ['id', 'employee', 'employee_id', 'training_program', 'program_name',
                  'enrollment_date', 'status', 'completion_date', 'score', 'certificate_url']
        read_only_fields = ['id', 'enrollment_date']


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        from .models import AuditLog
        model = AuditLog
        fields = ['id', 'user', 'user_email', 'user_name', 'action', 'resource_type',
                  'resource_id', 'description', 'before_data', 'after_data', 'ip_address',
                  'user_agent', 'status_code', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'user', 'user_email', 'user_name']
