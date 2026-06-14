from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from decimal import Decimal
import uuid

class BaseModel(models.Model):
    """Base model with common fields for all models"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Organization(BaseModel):
    """Multi-tenant Organization/Company model"""
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    industry = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    logo_url = models.URLField(blank=True)
    subscription_tier = models.CharField(
        max_length=20,
        choices=[('starter', 'Starter'), ('professional', 'Professional'), ('enterprise', 'Enterprise')],
        default='starter'
    )
    subscription_status = models.CharField(
        max_length=20,
        choices=[('active', 'Active'), ('trial', 'Trial'), ('suspended', 'Suspended'), ('cancelled', 'Cancelled')],
        default='trial'
    )
    employees_count = models.IntegerField(default=0)
    max_employees = models.IntegerField(default=10)  # Based on subscription tier

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['subscription_status']),
        ]

    def __str__(self):
        return self.name


class User(AbstractUser):
    """Custom User model with tenant association"""
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('hr', 'HR Manager'),
        ('manager', 'Department Manager'),
        ('employee', 'Employee'),
        ('recruiter', 'Recruiter'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='users')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_image_url = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False)
    last_login_at = models.DateTimeField(null=True, blank=True)
    
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_set',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_set',
    )

    class Meta:
        unique_together = ['email', 'organization']
        indexes = [
            models.Index(fields=['organization', 'role']),
            models.Index(fields=['email']),
        ]

    def __str__(self):
        return f"{self.get_full_name()} ({self.organization.name})"


class Department(BaseModel):
    """Department within an organization"""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    head = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_departments')
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    location = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ['organization', 'name']
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.organization.name}"


class Designation(BaseModel):
    """Job title/designation in organization"""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='designations')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    base_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    level = models.IntegerField(default=1)  # 1=Junior, 2=Mid, 3=Senior, 4=Lead, 5=Manager

    class Meta:
        unique_together = ['organization', 'name']
        ordering = ['level', 'name']

    def __str__(self):
        return f"{self.name} - {self.organization.name}"


class Employee(BaseModel):
    """Employee master data"""
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('contract', 'Contract'),
        ('temporary', 'Temporary'),
        ('intern', 'Intern'),
    ]

    EMPLOYMENT_STATUS_CHOICES = [
        ('active', 'Active'),
        ('on_leave', 'On Leave'),
        ('suspended', 'Suspended'),
        ('terminated', 'Terminated'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='employees')
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    employee_id = models.CharField(max_length=50)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='employees')
    designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, null=True, related_name='employees')
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES)
    employment_status = models.CharField(max_length=20, choices=EMPLOYMENT_STATUS_CHOICES, default='active')
    date_of_joining = models.DateField()
    date_of_termination = models.DateField(null=True, blank=True)
    pan_number = models.CharField(max_length=20, blank=True)
    aadhar_number = models.CharField(max_length=20, blank=True)
    bank_account_number = models.CharField(max_length=50, blank=True)
    bank_ifsc_code = models.CharField(max_length=20, blank=True)
    emergency_contact_name = models.CharField(max_length=255, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)

    class Meta:
        unique_together = ['organization', 'employee_id']
        ordering = ['-date_of_joining']
        indexes = [
            models.Index(fields=['organization', 'employment_status']),
            models.Index(fields=['department']),
        ]

    def __str__(self):
        return f"{self.employee_id} - {self.user.get_full_name()}"


class LeaveType(BaseModel):
    """Types of leaves available in organization"""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='leave_types')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    annual_limit = models.IntegerField()
    is_paid = models.BooleanField(default=True)
    requires_approval = models.BooleanField(default=True)
    carryforward_allowed = models.BooleanField(default=False)
    max_carryforward = models.IntegerField(default=0)

    class Meta:
        unique_together = ['organization', 'name']

    def __str__(self):
        return f"{self.name} - {self.organization.name}"


class LeaveBalance(BaseModel):
    """Track leave balance for each employee"""
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_balances')
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    balance = models.IntegerField(default=0)
    used = models.IntegerField(default=0)
    carryforward = models.IntegerField(default=0)
    year = models.IntegerField()

    class Meta:
        unique_together = ['employee', 'leave_type', 'year']

    def __str__(self):
        return f"{self.employee.employee_id} - {self.leave_type.name} ({self.year})"


class LeaveRequest(BaseModel):
    """Leave application/request from employee"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    number_of_days = models.IntegerField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    approval_date = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)

    class Meta:
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['employee', 'status']),
            models.Index(fields=['start_date', 'end_date']),
        ]

    def __str__(self):
        return f"{self.employee.employee_id} - {self.leave_type.name} ({self.start_date})"


class Attendance(BaseModel):
    """Daily attendance record"""
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('half_day', 'Half Day'),
        ('leave', 'Leave'),
        ('holiday', 'Holiday'),
        ('weekend', 'Weekend'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    check_in_time = models.TimeField(null=True, blank=True)
    check_out_time = models.TimeField(null=True, blank=True)
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    remarks = models.TextField(blank=True)

    class Meta:
        unique_together = ['employee', 'date']
        ordering = ['-date']
        indexes = [
            models.Index(fields=['employee', 'date']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.employee.employee_id} - {self.date} ({self.status})"


class SalaryStructure(BaseModel):
    """Salary structure template for designation"""
    designation = models.OneToOneField(Designation, on_delete=models.CASCADE, related_name='salary_structure')
    base_salary = models.DecimalField(max_digits=12, decimal_places=2)
    dearness_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    house_rent_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    other_allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Salary Structure - {self.designation.name}"


class SalarySlip(BaseModel):
    """Monthly salary slip"""
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='salary_slips')
    month = models.IntegerField()
    year = models.IntegerField()
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2)
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[('draft', 'Draft'), ('finalized', 'Finalized'), ('paid', 'Paid')],
        default='draft'
    )
    pay_date = models.DateField(null=True, blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['employee', 'month', 'year']
        ordering = ['-year', '-month']

    def __str__(self):
        return f"Salary Slip - {self.employee.employee_id} ({self.month}/{self.year})"


class PayrollRule(BaseModel):
    """Base class for payroll calculation rules"""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='payroll_rules')
    name = models.CharField(max_length=255)
    rule_type = models.CharField(
        max_length=50,
        choices=[
            ('income_tax', 'Income Tax'),
            ('pf', 'Provident Fund'),
            ('esi', 'ESI'),
            ('professional_tax', 'Professional Tax'),
            ('gratuity', 'Gratuity'),
            ('bonus', 'Bonus'),
        ]
    )
    version = models.IntegerField(default=1)
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    configuration = models.JSONField(default=dict)  # Stores rule configuration

    class Meta:
        unique_together = ['organization', 'rule_type', 'version']
        ordering = ['-version']

    def __str__(self):
        return f"{self.name} v{self.version}"


class JobPosting(BaseModel):
    """Job vacancy posting"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('closed', 'Closed'),
        ('on_hold', 'On Hold'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='job_postings')
    title = models.CharField(max_length=255)
    description = models.TextField()
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='job_postings')
    designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, null=True)
    experience_required = models.IntegerField()  # In years
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    posted_on = models.DateTimeField(auto_now_add=True)
    closed_on = models.DateTimeField(null=True, blank=True)
    openings = models.IntegerField(default=1)
    published_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-posted_on']
        indexes = [
            models.Index(fields=['organization', 'status']),
        ]

    def __str__(self):
        return f"{self.title} - {self.organization.name}"


class Candidate(BaseModel):
    """Job candidate/applicant"""
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('screening', 'Screening'),
        ('interview', 'Interview'),
        ('offered', 'Offered'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
        ('on_hold', 'On Hold'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='candidates')
    job_posting = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='candidates')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    resume_url = models.URLField()
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    current_location = models.CharField(max_length=255, blank=True)
    expected_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notice_period_days = models.IntegerField(default=30)
    applied_on = models.DateTimeField(auto_now_add=True)
    assigned_recruiter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_candidates')
    hired_employee = models.OneToOneField(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='candidate')

    class Meta:
        ordering = ['-applied_on']
        indexes = [
            models.Index(fields=['job_posting', 'status']),
            models.Index(fields=['email']),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.job_posting.title}"


class TrainingProgram(BaseModel):
    """Training/Learning program"""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='training_programs')
    name = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    duration_hours = models.IntegerField()
    trainer_name = models.CharField(max_length=255, blank=True)
    trainer_email = models.EmailField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    capacity = models.IntegerField(default=50)
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.name} - {self.organization.name}"


class TrainingEnrollment(BaseModel):
    """Employee enrollment in training"""
    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('dropped', 'Dropped'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='training_enrollments')
    training_program = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE, related_name='enrollments')
    enrollment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='registered')
    completion_date = models.DateField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
    certificate_url = models.URLField(blank=True)

    class Meta:
        unique_together = ['employee', 'training_program']

    def __str__(self):
        return f"{self.employee.employee_id} - {self.training_program.name}"


class Permission(BaseModel):
    """Fine-grained permissions in the system"""
    RESOURCE_CHOICES = [
        ('employees', 'Employees'),
        ('leave', 'Leave Management'),
        ('attendance', 'Attendance'),
        ('payroll', 'Payroll'),
        ('recruitment', 'Recruitment'),
        ('learning', 'Learning'),
        ('reports', 'Reports & Analytics'),
        ('settings', 'Settings'),
        ('audit', 'Audit Logs'),
    ]

    ACTION_CHOICES = [
        ('view', 'View'),
        ('create', 'Create'),
        ('edit', 'Edit'),
        ('delete', 'Delete'),
        ('approve', 'Approve'),
        ('export', 'Export'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    resource = models.CharField(max_length=50, choices=RESOURCE_CHOICES)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    code = models.CharField(max_length=100, unique=True)  # e.g., 'employees.view'

    class Meta:
        unique_together = ['resource', 'action']
        ordering = ['resource', 'action']

    def __str__(self):
        return f"{self.code}: {self.name}"


class Role(BaseModel):
    """Role definition with description and scope"""
    ROLE_TYPE_CHOICES = [
        ('platform_admin', 'Platform Administrator'),
        ('company_owner', 'Company Owner'),
        ('tenant_admin', 'Organization Admin'),
        ('hr_manager', 'HR Manager'),
        ('payroll_manager', 'Payroll Manager'),
        ('recruiter', 'Recruiter'),
        ('department_manager', 'Department Manager'),
        ('learning_manager', 'Learning Manager'),
        ('employee', 'Employee'),
        ('auditor', 'Auditor'),
    ]

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='roles',
        null=True,
        blank=True,  # NULL for platform-wide roles
    )
    name = models.CharField(max_length=255)
    role_type = models.CharField(max_length=50, choices=ROLE_TYPE_CHOICES, unique=True)
    description = models.TextField(blank=True)
    permissions = models.ManyToManyField(Permission, related_name='roles', through='RolePermission')
    is_system_role = models.BooleanField(default=False)  # Cannot be modified if True
    can_manage_users = models.BooleanField(default=False)
    can_manage_payroll = models.BooleanField(default=False)
    can_approve_leaves = models.BooleanField(default=False)
    can_generate_reports = models.BooleanField(default=False)
    can_view_audit_logs = models.BooleanField(default=False)

    class Meta:
        unique_together = ['organization', 'name']
        ordering = ['name']
        indexes = [
            models.Index(fields=['organization', 'role_type']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_role_type_display()})"


class RolePermission(BaseModel):
    """Mapping of roles to permissions with scope"""
    SCOPE_CHOICES = [
        ('all', 'All'),
        ('own_department', 'Own Department'),
        ('own_records', 'Own Records Only'),
        ('assigned_team', 'Assigned Team'),
    ]

    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    scope = models.CharField(max_length=50, choices=SCOPE_CHOICES, default='all')
    granted_at = models.DateTimeField(auto_now_add=True)
    granted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='permissions_granted',
    )

    class Meta:
        unique_together = ['role', 'permission']

    def __str__(self):
        return f"{self.role.name} -> {self.permission.code} ({self.scope})"


class UserRole(BaseModel):
    """Assignment of roles to users (user can have multiple roles)"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)
    assigned_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='roles_assigned',
    )
    expires_at = models.DateTimeField(null=True, blank=True)  # For temporary role assignments

    class Meta:
        unique_together = ['user', 'role']
        indexes = [
            models.Index(fields=['user', 'assigned_at']),
        ]

    def __str__(self):
        return f"{self.user.email} -> {self.role.name}"


class AuditLog(BaseModel):
    """Complete audit trail of all system actions"""
    ACTION_CHOICES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('approve', 'Approve'),
        ('reject', 'Reject'),
        ('export', 'Export'),
        ('login_failed', 'Login Failed'),
        ('permission_denied', 'Permission Denied'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='audit_logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    resource_type = models.CharField(max_length=100)  # e.g., 'Employee', 'LeaveRequest'
    resource_id = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    before_data = models.JSONField(null=True, blank=True)  # Previous values
    after_data = models.JSONField(null=True, blank=True)  # New values
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    status_code = models.IntegerField(null=True, blank=True)  # HTTP status
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['organization', 'action', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['resource_type', 'resource_id']),
        ]

    def __str__(self):
        return f"{self.action} - {self.resource_type} ({self.timestamp})"
