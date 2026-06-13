from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

# Navigation menu definitions per role
NAVIGATION_MENUS = {
    'platform_admin': [
        {'title': 'Dashboard', 'href': '/dashboard/platform-admin', 'icon': 'home'},
        {'title': 'Organizations', 'href': '/dashboard/platform-admin/organizations', 'icon': 'building'},
        {'title': 'Users', 'href': '/dashboard/platform-admin/users', 'icon': 'users'},
        {'title': 'Subscriptions', 'href': '/dashboard/platform-admin/subscriptions', 'icon': 'credit-card'},
        {'title': 'System Logs', 'href': '/dashboard/platform-admin/logs', 'icon': 'log'},
    ],
    'company_owner': [
        {'title': 'Dashboard', 'href': '/dashboard/owner', 'icon': 'home'},
        {'title': 'Organization', 'href': '/dashboard/owner/organization', 'icon': 'settings'},
        {'title': 'Billing', 'href': '/dashboard/owner/billing', 'icon': 'credit-card'},
        {'title': 'Team', 'href': '/dashboard/owner/team', 'icon': 'users'},
        {'title': 'Audit Logs', 'href': '/dashboard/owner/audit', 'icon': 'log'},
    ],
    'tenant_admin': [
        {'title': 'Dashboard', 'href': '/dashboard/admin', 'icon': 'home'},
        {'title': 'Employees', 'href': '/dashboard/admin/employees', 'icon': 'users'},
        {'title': 'Departments', 'href': '/dashboard/admin/departments', 'icon': 'layers'},
        {'title': 'Roles & Permissions', 'href': '/dashboard/admin/roles', 'icon': 'shield'},
        {'title': 'Settings', 'href': '/dashboard/admin/settings', 'icon': 'settings'},
        {'title': 'Audit Logs', 'href': '/dashboard/admin/audit', 'icon': 'log'},
    ],
    'hr_manager': [
        {'title': 'Dashboard', 'href': '/dashboard/hr', 'icon': 'home'},
        {'title': 'Employees', 'href': '/dashboard/hr/employees', 'icon': 'users'},
        {'title': 'Leave Management', 'href': '/dashboard/hr/leave', 'icon': 'calendar'},
        {'title': 'Attendance', 'href': '/dashboard/hr/attendance', 'icon': 'check-square'},
        {'title': 'Reports', 'href': '/dashboard/hr/reports', 'icon': 'bar-chart-2'},
    ],
    'payroll_manager': [
        {'title': 'Dashboard', 'href': '/dashboard/payroll', 'icon': 'home'},
        {'title': 'Salary Slips', 'href': '/dashboard/payroll/slips', 'icon': 'file-text'},
        {'title': 'Salary Structures', 'href': '/dashboard/payroll/structures', 'icon': 'layers'},
        {'title': 'Payroll Rules', 'href': '/dashboard/payroll/rules', 'icon': 'settings'},
        {'title': 'Reports', 'href': '/dashboard/payroll/reports', 'icon': 'bar-chart-2'},
    ],
    'recruiter': [
        {'title': 'Dashboard', 'href': '/dashboard/recruitment', 'icon': 'home'},
        {'title': 'Job Postings', 'href': '/dashboard/recruitment/jobs', 'icon': 'briefcase'},
        {'title': 'Candidates', 'href': '/dashboard/recruitment/candidates', 'icon': 'user-check'},
        {'title': 'Pipeline', 'href': '/dashboard/recruitment/pipeline', 'icon': 'flow'},
        {'title': 'Reports', 'href': '/dashboard/recruitment/reports', 'icon': 'bar-chart-2'},
    ],
    'department_manager': [
        {'title': 'Dashboard', 'href': '/dashboard/department', 'icon': 'home'},
        {'title': 'Team Members', 'href': '/dashboard/department/team', 'icon': 'users'},
        {'title': 'Leave Requests', 'href': '/dashboard/department/leave', 'icon': 'calendar'},
        {'title': 'Attendance', 'href': '/dashboard/department/attendance', 'icon': 'check-square'},
        {'title': 'Performance', 'href': '/dashboard/department/performance', 'icon': 'trending-up'},
    ],
    'learning_manager': [
        {'title': 'Dashboard', 'href': '/dashboard/learning', 'icon': 'home'},
        {'title': 'Training Programs', 'href': '/dashboard/learning/programs', 'icon': 'book'},
        {'title': 'Enrollments', 'href': '/dashboard/learning/enrollments', 'icon': 'users'},
        {'title': 'Reports', 'href': '/dashboard/learning/reports', 'icon': 'bar-chart-2'},
    ],
    'employee': [
        {'title': 'Dashboard', 'href': '/dashboard', 'icon': 'home'},
        {'title': 'My Profile', 'href': '/dashboard/profile', 'icon': 'user'},
        {'title': 'Leave Requests', 'href': '/dashboard/leave', 'icon': 'calendar'},
        {'title': 'Attendance', 'href': '/dashboard/attendance', 'icon': 'check-square'},
        {'title': 'Training', 'href': '/dashboard/training', 'icon': 'book'},
    ],
    'auditor': [
        {'title': 'Dashboard', 'href': '/dashboard/audit', 'icon': 'home'},
        {'title': 'Audit Logs', 'href': '/dashboard/audit/logs', 'icon': 'log'},
        {'title': 'Compliance Reports', 'href': '/dashboard/audit/compliance', 'icon': 'check-circle'},
        {'title': 'User Activities', 'href': '/dashboard/audit/activities', 'icon': 'activity'},
    ],
}

ENABLED_MODULES = {
    'platform_admin': ['organizations', 'users', 'billing'],
    'company_owner': ['organization', 'billing', 'team', 'employees', 'payroll', 'leave', 'recruitment'],
    'tenant_admin': ['employees', 'payroll', 'leave', 'attendance', 'recruitment', 'learning', 'roles'],
    'hr_manager': ['employees', 'leave', 'attendance', 'payroll'],
    'payroll_manager': ['payroll', 'employees'],
    'recruiter': ['recruitment', 'employees'],
    'department_manager': ['employees', 'leave', 'attendance'],
    'learning_manager': ['learning', 'employees'],
    'employee': ['profile', 'leave', 'attendance', 'training'],
    'auditor': ['audit', 'employees', 'payroll', 'leave', 'recruitment'],
}


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_navigation_menu(request):
    """Get dynamic navigation menu based on user roles"""
    try:
        user = request.user
        roles = user.user_roles.values_list('role__role_type', flat=True)
        
        # Get primary role (first role)
        primary_role = roles[0] if roles else 'employee'
        
        menu = NAVIGATION_MENUS.get(primary_role, NAVIGATION_MENUS['employee'])
        modules = ENABLED_MODULES.get(primary_role, [])
        
        return Response({
            'menu': menu,
            'primary_role': primary_role,
            'enabled_modules': modules,
        })

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
