from django.core.management.base import BaseCommand
from core.models import Permission, Role, RolePermission


class Command(BaseCommand):
    help = 'Initialize default permissions and system roles'

    def handle(self, *args, **options):
        self.stdout.write('Initializing RBAC system...')

        # Define permissions
        permissions_data = [
            # Employees
            ('employees', 'view', 'View Employees', 'employees.view'),
            ('employees', 'create', 'Create Employees', 'employees.create'),
            ('employees', 'edit', 'Edit Employees', 'employees.edit'),
            ('employees', 'delete', 'Delete Employees', 'employees.delete'),
            
            # Leave Management
            ('leave', 'view', 'View Leave Requests', 'leave.view'),
            ('leave', 'create', 'Create Leave Requests', 'leave.create'),
            ('leave', 'approve', 'Approve Leave Requests', 'leave.approve'),
            ('leave', 'edit', 'Edit Leave Requests', 'leave.edit'),
            
            # Attendance
            ('attendance', 'view', 'View Attendance', 'attendance.view'),
            ('attendance', 'create', 'Mark Attendance', 'attendance.create'),
            ('attendance', 'edit', 'Edit Attendance', 'attendance.edit'),
            ('attendance', 'export', 'Export Attendance', 'attendance.export'),
            
            # Payroll
            ('payroll', 'view', 'View Payroll', 'payroll.view'),
            ('payroll', 'create', 'Generate Salary Slips', 'payroll.create'),
            ('payroll', 'edit', 'Edit Payroll', 'payroll.edit'),
            ('payroll', 'approve', 'Approve Payroll', 'payroll.approve'),
            
            # Recruitment
            ('recruitment', 'view', 'View Job Postings', 'recruitment.view'),
            ('recruitment', 'create', 'Create Job Postings', 'recruitment.create'),
            ('recruitment', 'edit', 'Edit Job Postings', 'recruitment.edit'),
            ('recruitment', 'delete', 'Delete Job Postings', 'recruitment.delete'),
            
            # Learning
            ('learning', 'view', 'View Training Programs', 'learning.view'),
            ('learning', 'create', 'Create Training Programs', 'learning.create'),
            ('learning', 'edit', 'Edit Training Programs', 'learning.edit'),
            ('learning', 'delete', 'Delete Training Programs', 'learning.delete'),
            
            # Reports
            ('reports', 'view', 'View Reports', 'reports.view'),
            ('reports', 'export', 'Export Reports', 'reports.export'),
            
            # Settings
            ('settings', 'view', 'View Settings', 'settings.view'),
            ('settings', 'edit', 'Edit Settings', 'settings.edit'),
            
            # Audit
            ('audit', 'view', 'View Audit Logs', 'audit.view'),
        ]

        permissions_map = {}
        for resource, action, name, code in permissions_data:
            perm, created = Permission.objects.get_or_create(
                code=code,
                defaults={
                    'name': name,
                    'resource': resource,
                    'action': action,
                    'description': f'{name} permission'
                }
            )
            permissions_map[code] = perm
            if created:
                self.stdout.write(f'✓ Created permission: {code}')

        # Define system roles
        roles_data = [
            {
                'name': 'Platform Administrator',
                'role_type': 'platform_admin',
                'permissions': list(permissions_map.keys()),  # All permissions
                'is_system_role': True,
                'can_manage_users': True,
                'can_manage_payroll': True,
                'can_approve_leaves': True,
                'can_generate_reports': True,
                'can_view_audit_logs': True,
            },
            {
                'name': 'Company Owner',
                'role_type': 'company_owner',
                'permissions': list(permissions_map.keys()),  # All permissions
                'is_system_role': True,
                'can_manage_users': True,
                'can_manage_payroll': True,
                'can_approve_leaves': True,
                'can_generate_reports': True,
                'can_view_audit_logs': True,
            },
            {
                'name': 'Organization Admin',
                'role_type': 'tenant_admin',
                'permissions': list(permissions_map.keys()),  # All permissions
                'is_system_role': True,
                'can_manage_users': True,
                'can_manage_payroll': True,
                'can_approve_leaves': True,
                'can_generate_reports': True,
                'can_view_audit_logs': True,
            },
            {
                'name': 'HR Manager',
                'role_type': 'hr_manager',
                'permissions': [
                    'employees.view', 'employees.create', 'employees.edit',
                    'leave.view', 'leave.approve', 'attendance.view', 'attendance.create',
                    'reports.view', 'reports.export'
                ],
                'is_system_role': True,
                'can_manage_users': True,
                'can_approve_leaves': True,
                'can_generate_reports': True,
            },
            {
                'name': 'Payroll Manager',
                'role_type': 'payroll_manager',
                'permissions': [
                    'payroll.view', 'payroll.create', 'payroll.edit', 'payroll.approve',
                    'employees.view', 'reports.view', 'reports.export'
                ],
                'is_system_role': True,
                'can_manage_payroll': True,
                'can_generate_reports': True,
            },
            {
                'name': 'Recruiter',
                'role_type': 'recruiter',
                'permissions': [
                    'recruitment.view', 'recruitment.create', 'recruitment.edit',
                    'employees.view', 'candidates.view', 'candidates.edit'
                ],
                'is_system_role': True,
            },
            {
                'name': 'Department Manager',
                'role_type': 'department_manager',
                'permissions': [
                    'employees.view', 'leave.view', 'leave.approve',
                    'attendance.view', 'reports.view'
                ],
                'is_system_role': True,
                'can_approve_leaves': True,
            },
            {
                'name': 'Learning Manager',
                'role_type': 'learning_manager',
                'permissions': [
                    'learning.view', 'learning.create', 'learning.edit', 'learning.delete',
                    'employees.view', 'reports.view'
                ],
                'is_system_role': True,
            },
            {
                'name': 'Employee',
                'role_type': 'employee',
                'permissions': [
                    'employees.view', 'leave.view', 'leave.create',
                    'attendance.view', 'reports.view'
                ],
                'is_system_role': True,
            },
            {
                'name': 'Auditor',
                'role_type': 'auditor',
                'permissions': [
                    'audit.view', 'employees.view', 'reports.view'
                ],
                'is_system_role': True,
                'can_view_audit_logs': True,
            },
        ]

        for role_data in roles_data:
            perms = role_data.pop('permissions')
            role, created = Role.objects.get_or_create(
                role_type=role_data['role_type'],
                organization__isnull=True,  # System role (no organization)
                defaults=role_data
            )
            
            if created:
                self.stdout.write(f'✓ Created role: {role.name}')
                
                # Assign permissions to role
                for perm_code in perms:
                    if perm_code in permissions_map:
                        RolePermission.objects.get_or_create(
                            role=role,
                            permission=permissions_map[perm_code],
                            defaults={'scope': 'all'}
                        )

        self.stdout.write(self.style.SUCCESS('✓ RBAC initialization complete!'))
