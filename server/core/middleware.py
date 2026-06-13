"""
Multi-tenancy middleware for HireChamps
Extracts tenant information from request and stores in thread-local context
"""

import threading
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser

# Thread-local storage for current tenant and user context
_thread_locals = threading.local()


def get_current_organization():
    """Get the current organization from thread-local storage"""
    return getattr(_thread_locals, 'organization', None)


def get_current_user():
    """Get the current user from thread-local storage"""
    return getattr(_thread_locals, 'user', None)


def set_current_organization(organization):
    """Set the current organization in thread-local storage"""
    _thread_locals.organization = organization


def set_current_user(user):
    """Set the current user in thread-local storage"""
    _thread_locals.user = user


class TenantMiddleware(MiddlewareMixin):
    """
    Middleware to extract tenant information from request headers or URL
    and store in thread-local context for use throughout the request lifecycle
    """

    def process_request(self, request):
        """
        Process incoming request to extract tenant information
        Tenant can be specified via:
        1. X-Tenant-ID header
        2. X-Organization-Slug header
        """
        # Get tenant from headers
        tenant_id = request.META.get('HTTP_X_TENANT_ID')
        org_slug = request.META.get('HTTP_X_ORGANIZATION_SLUG')
        
        organization = None
        
        if request.user and not isinstance(request.user, AnonymousUser):
            # If user is authenticated, use their organization
            if hasattr(request.user, 'organization'):
                organization = request.user.organization
        elif tenant_id or org_slug:
            # Try to fetch organization from header
            try:
                from core.models import Organization
                if tenant_id:
                    organization = Organization.objects.get(id=tenant_id, is_active=True)
                elif org_slug:
                    organization = Organization.objects.get(slug=org_slug, is_active=True)
            except Organization.DoesNotExist:
                pass
        
        set_current_organization(organization)
        set_current_user(request.user)
        
        return None

    def process_response(self, request, response):
        """Clean up thread-local storage after request processing"""
        # Log failed login attempts
        if request.path == '/api/auth/login/' and request.method == 'POST':
            organization = get_current_organization()
            user = get_current_user()
            
            if response.status_code in [400, 401, 403]:
                from .permissions import PermissionChecker
                ip_address = self._get_client_ip(request)
                user_agent = request.META.get('HTTP_USER_AGENT', '')
                
                if organization:
                    action = 'login_failed' if response.status_code == 401 else 'permission_denied'
                    PermissionChecker.log_action(
                        organization=organization,
                        user=user,
                        action=action,
                        resource_type='User',
                        description=f'Failed login attempt',
                        ip_address=ip_address,
                        user_agent=user_agent,
                        status_code=response.status_code,
                    )
        
        # Clear thread-local data
        _thread_locals.organization = None
        _thread_locals.user = None
        return response

    def _get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
