from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    Organization, User, Department, Designation, Employee, LeaveType,
    LeaveBalance, LeaveRequest, Attendance, SalaryStructure, SalarySlip,
    PayrollRule, JobPosting, Candidate, TrainingProgram, TrainingEnrollment
)


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'subscription_tier', 'subscription_status', 'created_at']
    list_filter = ['subscription_tier', 'subscription_status', 'created_at']
    search_fields = ['name', 'email']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'organization', 'role', 'created_at']
    list_filter = ['role', 'organization', 'created_at', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Organization Info', {'fields': ('organization', 'role', 'phone', 'date_of_birth', 'is_verified')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Organization Info', {'fields': ('organization', 'role')}),
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'head', 'created_at']
    list_filter = ['organization', 'created_at']
    search_fields = ['name', 'organization__name']


@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'level', 'base_salary', 'created_at']
    list_filter = ['organization', 'level', 'created_at']
    search_fields = ['name', 'organization__name']


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'user', 'department', 'designation', 'employment_status', 'date_of_joining']
    list_filter = ['organization', 'employment_status', 'employment_type', 'date_of_joining']
    search_fields = ['employee_id', 'user__email', 'pan_number']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(LeaveType)
class LeaveTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'annual_limit', 'is_paid', 'created_at']
    list_filter = ['organization', 'is_paid', 'requires_approval']
    search_fields = ['name', 'organization__name']


@admin.register(LeaveBalance)
class LeaveBalanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'leave_type', 'year', 'balance', 'used']
    list_filter = ['year', 'leave_type', 'created_at']
    search_fields = ['employee__employee_id', 'leave_type__name']


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ['employee', 'leave_type', 'start_date', 'end_date', 'status', 'created_at']
    list_filter = ['status', 'leave_type', 'start_date']
    search_fields = ['employee__employee_id', 'reason']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'status', 'check_in_time', 'check_out_time', 'hours_worked']
    list_filter = ['status', 'date']
    search_fields = ['employee__employee_id']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SalaryStructure)
class SalaryStructureAdmin(admin.ModelAdmin):
    list_display = ['designation', 'base_salary', 'effective_from', 'effective_to']
    list_filter = ['effective_from', 'effective_to']
    search_fields = ['designation__name']


@admin.register(SalarySlip)
class SalarySlipAdmin(admin.ModelAdmin):
    list_display = ['employee', 'month', 'year', 'gross_salary', 'net_salary', 'status']
    list_filter = ['status', 'year', 'month']
    search_fields = ['employee__employee_id']
    readonly_fields = ['created_at', 'updated_at', 'generated_at']


@admin.register(PayrollRule)
class PayrollRuleAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'rule_type', 'version', 'effective_from', 'effective_to']
    list_filter = ['rule_type', 'organization', 'effective_from']
    search_fields = ['name', 'organization__name']


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'designation', 'status', 'openings', 'posted_on']
    list_filter = ['status', 'organization', 'posted_on']
    search_fields = ['title', 'description', 'organization__name']
    readonly_fields = ['posted_on']


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'job_posting', 'status', 'applied_on']
    list_filter = ['status', 'job_posting', 'applied_on']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    readonly_fields = ['applied_on']


@admin.register(TrainingProgram)
class TrainingProgramAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'start_date', 'end_date', 'capacity']
    list_filter = ['organization', 'start_date']
    search_fields = ['name', 'description', 'organization__name']


@admin.register(TrainingEnrollment)
class TrainingEnrollmentAdmin(admin.ModelAdmin):
    list_display = ['employee', 'training_program', 'status', 'completion_date']
    list_filter = ['status', 'training_program']
    search_fields = ['employee__employee_id', 'training_program__name']
    readonly_fields = ['enrollment_date']
