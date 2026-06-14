from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db.models import Q
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, UserRole, Organization
from .serializers import UserDetailSerializer
from .permissions import PermissionChecker


def _get_dashboard_route(user):
    """Get the appropriate dashboard route based on user's roles"""
    roles = PermissionChecker.user_get_roles(user)
    role_types = [role.role_type for role in roles]

    # Route mapping based on role priority
    route_map = {
        'platform_admin': '/dashboard/platform-admin',
        'company_owner': '/dashboard/owner',
        'tenant_admin': '/dashboard/admin',
        'payroll_manager': '/dashboard/payroll',
        'hr_manager': '/dashboard/hr',
        'recruiter': '/dashboard/recruitment',
        'learning_manager': '/dashboard/learning',
        'department_manager': '/dashboard/department',
        'auditor': '/dashboard/audit',
        'employee': '/dashboard',
    }

    # Return first matching route in priority order
    for role_type in role_types:
        if role_type in route_map:
            return route_map[role_type]

    return '/dashboard'  # Default


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Enhanced login endpoint supporting multiple credential types:
    - email + password
    - username + password
    - employee_id + password
    
    Returns user details, permissions, and dashboard route.
    """
    credential = request.data.get('credential')
    password = request.data.get('password')
    organization_id = request.data.get('organization_id')

    if not credential or not password:
        return Response(
            {'error': 'credential and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Try to authenticate with email, username, or employee_id
    user = None
    
    # Query by email
    user_obj = User.objects.filter(email=credential).first()
    if user_obj:
        user = authenticate(username=user_obj.username, password=password)
    
    # Query by username if not found
    if not user:
        user = authenticate(username=credential, password=password)
    
    # Query by employee_id if not found
    if not user:
        try:
            from .models import Employee
            employee = Employee.objects.filter(employee_id=credential).first()
            if employee:
                user = authenticate(username=employee.user.username, password=password)
        except Exception:
            pass

    if not user:
        # Log failed login attempt
        ip_address = request.META.get('REMOTE_ADDR', '')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        # Try to get organization for logging
        org = None
        if organization_id:
            org = Organization.objects.filter(id=organization_id).first()
        elif user_obj:
            org = user_obj.organization
        
        if org:
            PermissionChecker.log_action(
                organization=org,
                user=user_obj,
                action='login_failed',
                resource_type='User',
                description=f'Failed login attempt with credential: {credential}',
                ip_address=ip_address,
                user_agent=user_agent,
                status_code=401,
            )

        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Filter by organization if provided
    if organization_id:
        try:
            org = Organization.objects.get(id=organization_id)
            if user.organization_id != org.id:
                return Response(
                    {'error': 'User does not belong to specified organization'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Organization.DoesNotExist:
            return Response(
                {'error': 'Organization not found'},
                status=status.HTTP_400_BAD_REQUEST
            )

    # Update last login time
    user.last_login_at = timezone.now()
    user.save(update_fields=['last_login_at'])

    # Log successful login
    ip_address = request.META.get('REMOTE_ADDR', '')
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    PermissionChecker.log_action(
        organization=user.organization,
        user=user,
        action='login',
        resource_type='User',
        description=f'User logged in',
        ip_address=ip_address,
        user_agent=user_agent,
        status_code=200,
    )

    # Get user permissions and roles
    permissions = PermissionChecker.user_get_permissions(user)
    roles = PermissionChecker.user_get_roles(user)
    role_types = [role.role_type for role in roles]

    # Determine dashboard route
    dashboard_route = _get_dashboard_route(user)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    response_data = {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': UserDetailSerializer(user).data,
        'permissions': permissions,
        'roles': role_types,
        'dashboard_route': dashboard_route,
        'organization': {
            'id': str(user.organization.id),
            'name': user.organization.name,
            'slug': user.organization.slug,
        },
        'can_manage_users': PermissionChecker.user_can_manage_users(user),
        'can_manage_payroll': PermissionChecker.user_can_manage_payroll(user),
        'can_approve_leaves': PermissionChecker.user_can_approve_leaves(user),
        'can_view_audit_logs': PermissionChecker.user_can_view_audit_logs(user),
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout endpoint to log user logout action"""
    ip_address = request.META.get('REMOTE_ADDR', '')
    user_agent = request.META.get('HTTP_USER_AGENT', '')

    PermissionChecker.log_action(
        organization=request.user.organization,
        user=request.user,
        action='logout',
        resource_type='User',
        description='User logged out',
        ip_address=ip_address,
        user_agent=user_agent,
        status_code=200,
    )

    return Response(
        {'message': 'Logged out successfully'},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not old_password or not new_password:
        return Response(
            {'error': 'old_password and new_password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(old_password):
        PermissionChecker.log_action(
            organization=user.organization,
            user=user,
            action='permission_denied',
            resource_type='User',
            description='Failed password change attempt',
            status_code=401,
        )
        return Response(
            {'error': 'Old password is incorrect'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    user.set_password(new_password)
    user.save()

    PermissionChecker.log_action(
        organization=user.organization,
        user=user,
        action='update',
        resource_type='User',
        description='User changed their password',
        status_code=200,
    )

    return Response(
        {'message': 'Password changed successfully'},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user with permissions"""
    user = request.user

    permissions = PermissionChecker.user_get_permissions(user)
    roles = PermissionChecker.user_get_roles(user)
    role_types = [role.role_type for role in roles]

    response_data = {
        'user': UserDetailSerializer(user).data,
        'permissions': permissions,
        'roles': role_types,
        'dashboard_route': _get_dashboard_route(user),
        'can_manage_users': PermissionChecker.user_can_manage_users(user),
        'can_manage_payroll': PermissionChecker.user_can_manage_payroll(user),
        'can_approve_leaves': PermissionChecker.user_can_approve_leaves(user),
        'can_view_audit_logs': PermissionChecker.user_can_view_audit_logs(user),
    }

    return Response(response_data, status=status.HTTP_200_OK)
