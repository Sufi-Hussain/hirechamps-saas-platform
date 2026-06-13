from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.utils import timezone
import secrets

from .models import Organization, User, Role, UserRole
from .permissions import PermissionChecker
from .serializers import UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
@transaction.atomic
def register_company(request):
    """Self-service company registration"""
    try:
        company_name = request.data.get('company_name')
        domain = request.data.get('domain')
        country = request.data.get('country')
        owner_email = request.data.get('owner_email')
        owner_password = request.data.get('owner_password')
        owner_first_name = request.data.get('owner_first_name', '')
        owner_last_name = request.data.get('owner_last_name', '')

        # Validate inputs
        if not all([company_name, domain, country, owner_email, owner_password]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if organization already exists
        if Organization.objects.filter(slug=domain.lower()).exists():
            return Response({'error': 'Domain already registered'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=owner_email).exists():
            return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)

        # Create organization
        organization = Organization.objects.create(
            name=company_name,
            slug=domain.lower(),
            email=owner_email,
            country=country,
            subscription_tier='starter',
            subscription_status='trial',
        )

        # Create owner user
        owner_user = User.objects.create_user(
            email=owner_email,
            username=owner_email,
            password=owner_password,
            first_name=owner_first_name,
            last_name=owner_last_name,
            organization=organization,
            role='admin',
        )

        # Get or create company_owner role
        owner_role, _ = Role.objects.get_or_create(
            role_type='company_owner',
            defaults={
                'name': 'Company Owner',
                'organization': organization,
                'is_system_role': False,
                'can_manage_users': True,
                'can_manage_payroll': True,
                'can_approve_leaves': True,
            }
        )

        # Assign role
        UserRole.objects.create(user=owner_user, role=owner_role, assigned_by=owner_user)

        # Get or create tenant_admin role
        admin_role, _ = Role.objects.get_or_create(
            role_type='tenant_admin',
            defaults={
                'name': 'Organization Admin',
                'organization': organization,
                'is_system_role': False,
                'can_manage_users': True,
                'can_manage_payroll': True,
                'can_approve_leaves': True,
            }
        )

        # Log action
        PermissionChecker.log_action(
            organization=organization,
            user=owner_user,
            action='create',
            resource_type='Organization',
            resource_id=str(organization.id),
            description=f'Company registered: {company_name}',
            ip_address=PermissionChecker._get_client_ip(request),
        )

        return Response({
            'message': 'Company registered successfully',
            'organization_id': str(organization.id),
            'organization_name': organization.name,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def invite_employee(request):
    """Invite an employee to the organization"""
    try:
        organization = request.user.organization
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        designation_id = request.data.get('designation_id')

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email, organization=organization).exists():
            return Response({'error': 'User already exists in this organization'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate invite token
        invite_token = secrets.token_urlsafe(32)

        # Create user with temporary password
        temp_password = secrets.token_urlsafe(16)
        user = User.objects.create_user(
            email=email,
            username=email,
            password=temp_password,
            first_name=first_name,
            last_name=last_name,
            organization=organization,
            role='employee',
            is_active=True,
        )

        # Get employee role
        employee_role = Role.objects.get(role_type='employee', organization=organization)
        UserRole.objects.create(user=user, role=employee_role, assigned_by=request.user)

        # Log action
        PermissionChecker.log_action(
            organization=organization,
            user=request.user,
            action='create',
            resource_type='User',
            resource_id=str(user.id),
            description=f'Employee invited: {email}',
            ip_address=PermissionChecker._get_client_ip(request),
        )

        return Response({
            'message': 'Employee invited successfully',
            'user_id': str(user.id),
            'email': email,
            'invite_link': f'/auth/invite?token={invite_token}',
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_hr_user(request):
    """Create HR manager user (company owner/admin only)"""
    try:
        organization = request.user.organization
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check permission
        if not request.user.user_roles.filter(role__can_manage_users=True).exists():
            return Response({'error': 'Insufficient permissions'}, status=status.HTTP_403_FORBIDDEN)

        if User.objects.filter(email=email, organization=organization).exists():
            return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        temp_password = secrets.token_urlsafe(16)
        user = User.objects.create_user(
            email=email,
            username=email,
            password=temp_password,
            first_name=first_name,
            last_name=last_name,
            organization=organization,
            role='hr',
            is_active=True,
        )

        # Get HR role
        hr_role = Role.objects.get(role_type='hr_manager', organization=organization)
        UserRole.objects.create(user=user, role=hr_role, assigned_by=request.user)

        # Log action
        PermissionChecker.log_action(
            organization=organization,
            user=request.user,
            action='create',
            resource_type='User',
            resource_id=str(user.id),
            description=f'HR user created: {email}',
            ip_address=PermissionChecker._get_client_ip(request),
        )

        return Response({
            'message': 'HR user created successfully',
            'user_id': str(user.id),
            'email': email,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_organizations(request):
    """Get all organizations where user has access"""
    try:
        user = request.user
        orgs = Organization.objects.filter(users=user)
        
        return Response({
            'organizations': [
                {
                    'id': str(org.id),
                    'name': org.name,
                    'slug': org.slug,
                }
                for org in orgs
            ]
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
