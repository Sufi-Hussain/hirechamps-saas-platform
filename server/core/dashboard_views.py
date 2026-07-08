from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import Q, Prefetch, F
from datetime import timedelta

from .models import (
    User, Employee, Invite, LeaveRequest, AuditLog, 
    Organization, Announcement, Holiday
)
from .serializers import (
    InviteSerializer, LeaveRequestSerializer, AuditLogSerializer
)
from .permissions import PermissionChecker


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_hr(request):
    """
    Unified HR Dashboard endpoint - returns all dashboard data in a single response.
    Restricted to authenticated HR/Admin users only.
    """
    try:
        # Permission check - only HR and Admin users
        if not PermissionChecker.user_can_manage_users(request.user):
            return Response(
                {'error': 'Permission denied. HR/Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        organization = request.user.organization
        now = timezone.now()
        today = now.date()
        
        # ===== STATS =====
        # Total employees
        total_employees = Employee.objects.filter(
            organization=organization,
            is_active=True
        ).count()
        
        # Active employees (active and not on leave)
        active_employees = Employee.objects.filter(
            organization=organization,
            is_active=True,
            user__is_active=True
        ).count()
        
        # Pending invites
        pending_invites = Invite.objects.filter(
            user__organization=organization,
            is_used=False,
            expires_at__gt=now
        ).count()
        
        # New joiners this month
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        new_joiners = Employee.objects.filter(
            organization=organization,
            created_at__gte=month_start
        ).count()
        
        # Employees on leave today
        on_leave_today = LeaveRequest.objects.filter(
            employee__organization=organization,
            start_date__lte=today,
            end_date__gte=today,
            status='approved'
        ).count()
        
        stats = {
            'total_employees': total_employees,
            'active_employees': active_employees,
            'pending_invites': pending_invites,
            'new_joiners': new_joiners,
            'employees_on_leave': on_leave_today,
        }
        
        # ===== RECENT INVITES (top 5) =====
        recent_invites = Invite.objects.filter(
            user__organization=organization
        ).select_related('user').order_by('-created_at')[:5]
        
        recent_invites_data = []
        for invite in recent_invites:
            recent_invites_data.append({
                'id': str(invite.id),
                'email': invite.user.email,
                'name': invite.user.get_full_name(),
                'status': 'accepted' if invite.is_used else ('expired' if invite.expires_at < now else 'pending'),
                'sent_date': invite.created_at.isoformat(),
                'expires_at': invite.expires_at.isoformat(),
            })
        
        # ===== PENDING LEAVE REQUESTS (top 5) =====
        pending_leaves = LeaveRequest.objects.filter(
            employee__organization=organization,
            status='pending'
        ).select_related('employee', 'employee__user', 'leave_type').order_by('-created_at')[:5]
        
        pending_leaves_data = []
        for leave in pending_leaves:
            pending_leaves_data.append({
                'id': str(leave.id),
                'employee_name': leave.employee.user.get_full_name(),
                'employee_id': str(leave.employee.id),
                'leave_type': leave.leave_type.name,
                'start_date': leave.start_date.isoformat(),
                'end_date': leave.end_date.isoformat(),
                'reason': leave.reason,
                'created_at': leave.created_at.isoformat(),
                'days': (leave.end_date - leave.start_date).days + 1,
            })
        
        # ===== RECENT ACTIVITY (top 10) =====
        recent_activity = AuditLog.objects.filter(
            organization=organization
        ).select_related('user').order_by('-timestamp')[:10]
        
        activity_emoji = {
            'create': '✨',
            'update': '✏️',
            'delete': '🗑️',
            'login': '👤',
            'logout': '👋',
            'approve': '✅',
            'reject': '❌',
        }
        
        recent_activity_data = []
        for log in recent_activity:
            action_emoji = activity_emoji.get(log.action, '📝')
            recent_activity_data.append({
                'id': str(log.id),
                'user_name': log.user.get_full_name(),
                'action': log.action,
                'action_emoji': action_emoji,
                'resource_type': log.resource_type,
                'description': log.description,
                'timestamp': log.timestamp.isoformat(),
            })
        
        # ===== UPCOMING EVENTS (birthdays & anniversaries) =====
        upcoming_events_data = []
        
        # Birthdays in next 30 days
        today_year = today.year
        future_date = today + timedelta(days=30)
        
        for employee in Employee.objects.filter(
            organization=organization,
            user__date_of_birth__isnull=False
        ).select_related('user'):
            dob = employee.user.date_of_birth
            if dob:
                # Get this year's birthday
                birthday_this_year = dob.replace(year=today_year)
                
                # If birthday passed this year, check next year
                if birthday_this_year < today:
                    birthday_this_year = dob.replace(year=today_year + 1)
                
                # Check if birthday is within next 30 days
                if today <= birthday_this_year <= future_date:
                    upcoming_events_data.append({
                        'type': 'birthday',
                        'name': employee.user.get_full_name(),
                        'date': birthday_this_year.isoformat(),
                        'employee_id': str(employee.id),
                    })
        
        # Work anniversaries in next 30 days
        for employee in Employee.objects.filter(
            organization=organization,
            date_of_joining__isnull=False
        ).select_related('user'):
            if employee.date_of_joining:
                anniversary = employee.date_of_joining.replace(year=today_year)
                
                if anniversary < today:
                    anniversary = employee.date_of_joining.replace(year=today_year + 1)
                
                if today <= anniversary <= future_date:
                    years_of_service = today_year - employee.date_of_joining.year
                    upcoming_events_data.append({
                        'type': 'anniversary',
                        'name': employee.user.get_full_name(),
                        'date': anniversary.isoformat(),
                        'years': years_of_service,
                        'employee_id': str(employee.id),
                    })
        
        # Sort by date
        upcoming_events_data.sort(key=lambda x: x['date'])
        
        # ===== ANNOUNCEMENTS (top 5) =====
        announcements = Announcement.objects.filter(
            organization=organization,
            is_active=True
        ).order_by('-created_at')[:5]
        
        announcements_data = []
        priority_map = {'low': 0, 'medium': 1, 'high': 2}
        
        for announcement in announcements:
            announcements_data.append({
                'id': str(announcement.id),
                'title': announcement.title,
                'content': announcement.content,
                'priority': announcement.priority,
                'priority_level': priority_map.get(announcement.priority, 0),
                'author': announcement.created_by.get_full_name() if announcement.created_by else 'System',
                'created_at': announcement.created_at.isoformat(),
            })
        
        # Sort by priority (high first)
        announcements_data.sort(key=lambda x: x['priority_level'], reverse=True)
        
        # ===== ASSEMBLE RESPONSE =====
        response_data = {
            'stats': stats,
            'recent_invites': recent_invites_data,
            'pending_leave_requests': pending_leaves_data,
            'recent_activity': recent_activity_data,
            'upcoming_events': upcoming_events_data,
            'announcements': announcements_data,
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to load dashboard: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
