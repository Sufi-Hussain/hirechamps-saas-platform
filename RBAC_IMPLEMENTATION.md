# HireChamps RBAC & Authentication Implementation

## Overview

Complete Role-Based Access Control (RBAC) system with multi-credential authentication, audit logging, and permission-based feature access.

## Architecture

### Backend Components

#### 1. **Models** (`server/core/models.py`)

- **Permission**: Fine-grained permissions (employees.view, payroll.approve, etc.)
- **Role**: Defines 10 system role types with hierarchical permissions
- **RolePermission**: Maps permissions to roles with scope control
- **UserRole**: Assigns roles to users (many-to-many with expiration support)
- **AuditLog**: Immutable audit trail of all actions

#### 2. **Permission Engine** (`server/core/permissions.py`)

```python
PermissionChecker class provides:
- user_has_permission(user, code, scope)
- user_get_permissions(user)  # Dict of all permissions
- user_get_roles(user)
- Capability checks: can_manage_users, can_manage_payroll, etc.
- log_action() for audit logging
```

DRF Permission Classes:
- `HasPermission`: Check specific permission codes
- `IsRoleType`: Verify user role type(s)
- `IsTenantAdmin`: Admin-only endpoints
- `IsAuditViewer`: Audit log access
- `CanManagePayroll`, `CanApproveLeaves`, etc.

#### 3. **Authentication** (`server/core/auth_views.py`)

Enhanced login endpoint supporting:
- Email + password
- Username + password
- Employee ID + password
- Auto-tenant detection
- Role-based dashboard routing

Endpoints:
- `POST /api/auth/login/` - Multi-credential login
- `POST /api/auth/logout/` - Logout with audit logging
- `POST /api/auth/change-password/` - Password change
- `GET /api/auth/me/` - Current user with permissions

#### 4. **Audit Logging** (`server/core/middleware.py`)

Middleware captures:
- Login/logout events
- Failed access attempts
- Request IP and user agent
- Auto-logged on all model changes via signals

ViewSet: `AuditLogViewSet` (read-only, permission-gated)

### Frontend Components

#### 1. **Auth Store** (`lib/store.ts`)

Zustand store with:
```typescript
- user, organization, accessToken
- permissions: Record<string, string>
- roles: string[]
- dashboardRoute: string
- Capabilities: canManageUsers, canManagePayroll, etc.

Methods:
- login(credential, password, organizationId?)
- hasPermission(code) -> boolean
- hasRole(roleType) -> boolean
- hasAnyPermission(codes) -> boolean
```

#### 2. **Protected Routes** (`components/ProtectedRoute.tsx`)

```typescript
<ProtectedRoute requiredRoles={['tenant_admin']} requiredPermissions={['payroll.approve']}>
  <PayrollPage />
</ProtectedRoute>

<PermissionGuard permission="employees.edit">
  <EditButton />
</PermissionGuard>

<RoleGuard roles={['hr_manager', 'tenant_admin']}>
  <HRPanel />
</RoleGuard>
```

#### 3. **Enhanced Login** (`app/auth/login/page.tsx`)

- Multi-credential input (email/username/employee_id)
- Automatic role-based dashboard routing
- Real-time permission loading

## 10 Role Types

| Role | Permissions | Dashboard Route | Use Case |
|------|------------|-----------------|----------|
| **Platform Admin** | All | `/dashboard/platform-admin` | Vercel SaaS admin |
| **Company Owner** | All | `/dashboard/owner` | Business owner with full access |
| **Tenant Admin** | All | `/dashboard/admin` | Organization administrator |
| **HR Manager** | Employees, Leave, Attendance, Reports | `/dashboard/hr` | HR department |
| **Payroll Manager** | Payroll, Employees, Reports | `/dashboard/payroll` | Finance/Payroll |
| **Recruiter** | Recruitment, Employees, Candidates | `/dashboard/recruitment` | Hiring team |
| **Department Manager** | Employees, Leave (approval), Attendance, Reports | `/dashboard/department` | Department head |
| **Learning Manager** | Learning, Training Programs | `/dashboard/learning` | Training coordinator |
| **Employee** | Own records, Leave requests, Attendance | `/dashboard` | Regular employee |
| **Auditor** | Audit logs, Reports, Employees (view) | `/dashboard/audit` | Compliance officer |

## Permission Matrix

### Resources & Actions

```
employees:     [view, create, edit, delete]
leave:         [view, create, approve, edit]
attendance:    [view, create, edit, export]
payroll:       [view, create, edit, approve]
recruitment:   [view, create, edit, delete]
learning:      [view, create, edit, delete]
reports:       [view, export]
settings:      [view, edit]
audit:         [view]
```

### Scope Control

Permissions can be scoped:
- `all`: Full access
- `own_department`: Only own department records
- `own_records`: Only own records (employee's own data)
- `assigned_team`: Only team members assigned to user

## Initialization

```bash
# Run this after migrations to create system roles and permissions:
python manage.py init_rbac
```

This creates:
- 30+ permissions across 9 resources
- 10 system roles with appropriate permission assignments

## API Usage

### Check Permission (DRF ViewSet)

```python
from .permissions import HasPermission, CanManagePayroll

class PayrollViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, CanManagePayroll]
    required_permission = 'payroll.edit'
```

### Manual Permission Check

```python
from .permissions import PermissionChecker

if PermissionChecker.user_has_permission(user, 'employees.edit'):
    # Allow edit
```

### Log Action

```python
PermissionChecker.log_action(
    organization=org,
    user=request.user,
    action='update',
    resource_type='Employee',
    resource_id=employee_id,
    before_data={'name': 'John'},
    after_data={'name': 'John Doe'},
    ip_address='192.168.1.1',
    status_code=200
)
```

## Frontend Usage

### Protected Routes

```typescript
import { ProtectedRoute, PermissionGuard, RoleGuard } from '@/components/ProtectedRoute'
import { useAuthStore } from '@/lib/store'

// Require specific roles
<ProtectedRoute requiredRoles="tenant_admin">
  <AdminPanel />
</ProtectedRoute>

// Require multiple roles (any match)
<ProtectedRoute requiredRoles={['tenant_admin', 'hr_manager']}>
  <ManagementPanel />
</ProtectedRoute>

// Permission-based guard (UI rendering)
<PermissionGuard permission="employees.edit">
  <EditButton />
</PermissionGuard>

// Role-based UI rendering
<RoleGuard roles="payroll_manager">
  <PayrollTab />
</RoleGuard>
```

### Check in Components

```typescript
const { hasPermission, hasRole, canManagePayroll } = useAuthStore()

{canManagePayroll && <PayrollButton />}

{hasPermission('employees.delete') && <DeleteButton />}

{hasRole(['tenant_admin', 'hr_manager']) && <AdminPanel />}
```

## Audit Trail

### View Audit Logs

```
GET /api/audit-logs/
GET /api/audit-logs/?action=login&user__email=john@example.com
GET /api/audit-logs/my_actions/
```

### Audit Log Fields

- `user`: Who performed the action
- `action`: login, logout, create, update, delete, approve, etc.
- `resource_type`: Employee, LeaveRequest, SalarySlip, etc.
- `resource_id`: ID of affected resource
- `before_data`: Values before change (for updates)
- `after_data`: Values after change (for updates)
- `ip_address`: Requester IP
- `user_agent`: Browser info
- `timestamp`: When action occurred
- `status_code`: HTTP response code

### Immutable Audit Logs

- No direct creation, update, or deletion
- Auto-generated by middleware and PermissionChecker
- Full historical record of all changes

## Security Considerations

1. **Multi-tenancy**: All queries filtered by user.organization
2. **Token Storage**: Auth token in localStorage (can be upgraded to httpOnly)
3. **Permission Caching**: Permissions loaded on login, refreshable via /auth/me/
4. **Audit Trail**: Complete history for compliance and debugging
5. **Role Expiration**: UserRole supports expires_at for temporary assignments
6. **Scope Limiting**: Permissions can be scoped to departments or own records

## Future Enhancements

- Single Sign-On (SSO) integration
- Two-factor authentication (2FA)
- OAuth2 / SAML support
- Dynamic role creation UI
- Permission assignment UI
- Audit log export/visualization
- Real-time permission updates
- IP whitelist/blacklist
- Session management
- Login attempt rate limiting

## Database Schema

```
Permission (30+ records)
  ├── code (unique)
  ├── name
  ├── resource (employees, payroll, etc.)
  └── action (view, create, edit, approve, export)

Role (10 system roles)
  ├── name
  ├── role_type (unique platform_admin, company_owner, etc.)
  ├── is_system_role
  └── capability flags (can_manage_users, etc.)

RolePermission
  ├── role
  ├── permission
  └── scope (all, own_department, own_records, assigned_team)

UserRole
  ├── user
  ├── role
  ├── assigned_at
  ├── expires_at (nullable)
  └── assigned_by

AuditLog (immutable)
  ├── user
  ├── action
  ├── resource_type
  ├── resource_id
  ├── before_data (JSON)
  ├── after_data (JSON)
  ├── ip_address
  ├── user_agent
  └── timestamp
```

## Testing Credentials (After init_rbac)

Create test users for each role via Django admin or API:

```python
from core.models import User, Organization, UserRole, Role

org = Organization.objects.create(name='Test Company', slug='test')

# Create users and assign roles
admin_user = User.objects.create_user(
    email='admin@test.com',
    username='admin',
    password='test123',
    organization=org
)

admin_role = Role.objects.get(role_type='tenant_admin')
UserRole.objects.create(user=admin_user, role=admin_role)
```

Then login with: `admin@test.com / test123`

---

**Last Updated**: 2026-06-13
**Version**: 1.0
