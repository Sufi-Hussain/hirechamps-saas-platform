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
