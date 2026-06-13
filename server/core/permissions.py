from rest_framework import permissions
from .models import Role, UserRole, RolePermission, AuditLog
from django.utils import timezone


class PermissionChecker:
    """Utility class to check permissions for a user"""

    @staticmethod
    def user_has_permission(user, permission_code, scope='all'):
        """
        Check if user has a specific permission.
        
        Args:
            user: User object
            permission_code: Permission code (e.g., 'employees.view')
            scope: Check scope ('all', 'own_department', 'own_records', 'assigned_team')
        
        Returns:
            bool: True if user has permission
        """
        if not user or not user.is_authenticated:
            return False

        # Platform admins have all permissions
        active_roles = UserRole.objects.filter(
            user=user,
            expires_at__isnull=True  # Not expired
        ).select_related('role')

        for user_role in active_roles:
            if user_role.role.role_type == 'platform_admin':
                return True

            # Check if role has permission
            role_perms = RolePermission.objects.filter(
                role=user_role.role,
                permission__code=permission_code
            )

            if scope == 'all' and role_perms.exists():
                return True

            if role_perms.filter(scope=scope).exists():
                return True

        return False

    @staticmethod
    def user_get_permissions(user):
        """Get all permissions for a user"""
        if not user or not user.is_authenticated:
            return {}

        permissions_dict = {}
        active_roles = UserRole.objects.filter(
            user=user,
            expires_at__isnull=True
        ).select_related('role')

        for user_role in active_roles:
            role_perms = RolePermission.objects.filter(
                role=user_role.role
            ).select_related('permission')

            for role_perm in role_perms:
                perm_code = role_perm.permission.code
                if perm_code not in permissions_dict:
                    permissions_dict[perm_code] = role_perm.scope
                # Use 'all' if any role grants 'all' scope
                elif permissions_dict[perm_code] != 'all':
                    permissions_dict[perm_code] = role_perm.scope

        return permissions_dict

    @staticmethod
    def user_get_roles(user):
        """Get all active roles for a user"""
        if not user or not user.is_authenticated:
            return []

        active_roles = UserRole.objects.filter(
            user=user,
            expires_at__isnull=True
        ).select_related('role')

        return [ur.role for ur in active_roles]

    @staticmethod
    def user_can_manage_users(user):
        """Check if user can manage other users"""
        if not user or not user.is_authenticated:
            return False

        roles = PermissionChecker.user_get_roles(user)
        return any(role.can_manage_users for role in roles)

    @staticmethod
    def user_can_manage_payroll(user):
        """Check if user can manage payroll"""
        if not user or not user.is_authenticated:
            return False

        roles = PermissionChecker.user_get_roles(user)
        return any(role.can_manage_payroll for role in roles)

    @staticmethod
    def user_can_approve_leaves(user):
        """Check if user can approve leave requests"""
        if not user or not user.is_authenticated:
            return False

        roles = PermissionChecker.user_get_roles(user)
        return any(role.can_approve_leaves for role in roles)

    @staticmethod
    def user_can_view_audit_logs(user):
        """Check if user can view audit logs"""
        if not user or not user.is_authenticated:
            return False

        roles = PermissionChecker.user_get_roles(user)
        return any(role.can_view_audit_logs for role in roles)

    @staticmethod
    def log_action(organization, user, action, resource_type, resource_id='', 
                   description='', before_data=None, after_data=None, 
                   ip_address='', user_agent='', status_code=200):
        """Log an audit action"""
        try:
            AuditLog.objects.create(
                organization=organization,
                user=user,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                description=description,
                before_data=before_data,
                after_data=after_data,
                ip_address=ip_address,
                user_agent=user_agent,
                status_code=status_code,
            )
        except Exception as e:
            print(f"Error logging audit action: {e}")


# DRF Permission Classes

class IsAuthenticated(permissions.BasePermission):
    """Check if user is authenticated"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated


class HasPermission(permissions.BasePermission):
    """Check if user has specific permission"""
    
    def has_permission(self, request, view):
        # Get required permission from view
        required_permission = getattr(view, 'required_permission', None)
        if not required_permission:
            return True

        return PermissionChecker.user_has_permission(
            request.user,
            required_permission
        )


class IsRoleType(permissions.BasePermission):
    """Check if user has specific role type"""
    
    def has_permission(self, request, view):
        required_role = getattr(view, 'required_role_type', None)
        if not required_role:
            return True

        roles = PermissionChecker.user_get_roles(request.user)
        role_types = [role.role_type for role in roles]

        if isinstance(required_role, str):
            return required_role in role_types
        else:
            return any(r in role_types for r in required_role)


class IsTenantAdmin(permissions.BasePermission):
    """Check if user is admin of their organization"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        roles = PermissionChecker.user_get_roles(request.user)
        role_types = [role.role_type for role in roles]

        return 'tenant_admin' in role_types or 'platform_admin' in role_types


class IsAuditViewer(permissions.BasePermission):
    """Check if user can view audit logs"""
    
    def has_permission(self, request, view):
        return PermissionChecker.user_can_view_audit_logs(request.user)


class CanManageUsers(permissions.BasePermission):
    """Check if user can manage users"""
    
    def has_permission(self, request, view):
        return PermissionChecker.user_can_manage_users(request.user)


class CanManagePayroll(permissions.BasePermission):
    """Check if user can manage payroll"""
    
    def has_permission(self, request, view):
        return PermissionChecker.user_can_manage_payroll(request.user)


class CanApproveLeaves(permissions.BasePermission):
    """Check if user can approve leaves"""
    
    def has_permission(self, request, view):
        return PermissionChecker.user_can_approve_leaves(request.user)
