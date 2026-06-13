# HireChamps: Dashboards & Authentication Flows Implementation

## Overview
Complete implementation of 10 role-specific dashboards, account creation workflows, and authentication flows with multi-tenancy support.

## Backend Implementation

### 1. Account Management Workflows (`server/core/account_views.py`)

#### Self-Service Company Registration
- **Endpoint**: `POST /api/auth/register-company/`
- **Inputs**: company_name, domain, country, owner_email, owner_password
- **Output**: organization_id, confirmation message
- **Features**:
  - Domain uniqueness validation
  - Email uniqueness check
  - Creates organization with trial subscription
  - Creates owner user with company_owner role
  - Creates tenant_admin role for future use
  - Automatic audit logging

#### Employee Invitation
- **Endpoint**: `POST /api/accounts/invite-employee/`
- **Permission**: HR Manager or Admin
- **Inputs**: email, first_name, last_name, designation_id
- **Output**: user_id, invite_link
- **Features**:
  - Generates temporary password
  - Assigns employee role
  - Creates audit trail
  - Sends invite notification (future enhancement)

#### HR User Creation
- **Endpoint**: `POST /api/accounts/create-hr-user/`
- **Permission**: Company Owner or Tenant Admin
- **Inputs**: email, first_name, last_name
- **Output**: user_id, email
- **Features**:
  - Validates create permission
  - Assigns hr_manager role
  - Creates in organization context
  - Audit logging

#### User Organizations List
- **Endpoint**: `GET /api/accounts/my-organizations/`
- **Returns**: List of all organizations user has access to
- **Use Case**: Multi-org user switching

### 2. Navigation API (`server/core/navigation_views.py`)

#### Dynamic Navigation Menu
- **Endpoint**: `GET /api/navigation/menu/`
- **Returns**: Role-specific menu and enabled modules
- **Per-Role Navigation**:
  - Platform Admin: Organizations, Users, Subscriptions, System Logs
  - Company Owner: Dashboard, Organization, Billing, Team, Audit
  - Tenant Admin: Employees, Departments, Roles, Settings, Audit
  - HR Manager: Employees, Leave, Attendance, Reports
  - Payroll Manager: Salary Slips, Structures, Rules, Reports
  - Recruiter: Job Postings, Candidates, Pipeline, Reports
  - Department Manager: Team, Leave Requests, Attendance, Performance
  - Learning Manager: Programs, Enrollments, Reports
  - Employee: Profile, Leave, Attendance, Training
  - Auditor: Logs, Compliance, Activities

### 3. Enhanced Login Response
Updates to `/api/auth/login/` to return:
```json
{
  "user": { "id", "email", "first_name", "last_name", "role" },
  "permissions": { "employees.view": true, ... },
  "roles": ["hr_manager"],
  "dashboard_route": "/dashboard/hr",
  "organization": { "id", "name", "slug" },
  "can_manage_users": true,
  "can_manage_payroll": false,
  "can_approve_leaves": true,
  "can_view_audit_logs": false,
  "modules_enabled": ["employees", "leave", "attendance"],
  "token": "jwt_token_here"
}
```

## Frontend Implementation

### 1. Authentication Store Enhancement (`lib/store.ts`)
- **New Fields**: permissions, roles, dashboardRoute, canManageUsers, canManagePayroll, etc.
- **Helper Methods**:
  - `hasPermission(code)` - Check single permission
  - `hasRole(role)` - Check single or multiple roles
  - `hasAnyPermission(permissions)` - Check any permission
  - `login()` - Enhanced with multi-credential support
  - `refreshUser()` - Refresh permissions on demand

### 2. Permission Guard Hook (`hooks/usePermissionGuard.ts`)
Protects pages requiring specific permissions or roles:
```typescript
export function usePermissionGuard(requiredPermission?: string, requiredRole?: string | string[])
```
- Auto-redirects to `/auth/login` if not authenticated
- Auto-redirects to `/access-denied` if unauthorized
- Uses router push for SPA navigation

### 3. Role-Based Dashboards

#### 10 Dashboard Pages Created:
1. **Platform Admin** (`/dashboard/platform-admin`)
   - Organizations count
   - Active users
   - Monthly revenue
   - System health

2. **Company Owner** (`/dashboard/owner`)
   - Team members
   - Subscription status
   - Growth metrics
   - Active projects

3. **Tenant Admin** (`/dashboard/admin`)
   - Total employees
   - Departments
   - Active roles
   - System activity

4. **HR Manager** (`/dashboard/hr`)
   - Total employees
   - Pending leave requests
   - Present today
   - Department growth

5. **Payroll Manager** (`/dashboard/payroll`)
   - Monthly payroll
   - Processed slips
   - Tax deducted
   - Processing status

6. **Recruiter** (`/dashboard/recruitment`)
   - Open positions
   - Active candidates
   - Hire rate
   - Avg time to hire

7. **Department Manager** (`/dashboard/department`)
   - Team size
   - Leave requests
   - Present today
   - Performance rating

8. **Learning Manager** (`/dashboard/learning`)
   - Active programs
   - Enrolled count
   - Completed
   - Completion rate

9. **Employee** (`/dashboard`)
   - Leave balance
   - Present this month
   - In-progress courses
   - Completed certifications

10. **Auditor** (`/dashboard/audit`)
    - Audit logs count
    - Compliance score
    - Last scan time
    - Issues found

### 4. Authentication Flows

#### Login Flow
1. User enters credential (email, username, or employee_id)
2. Backend validates and returns dashboard_route
3. Frontend redirects to role-specific dashboard
4. Store saves permissions for authorization checks

#### Company Registration Flow
1. User enters company info (name, domain, country)
2. User enters owner details (name, email)
3. User creates password
4. Backend creates organization and owner account
5. Auto-login and redirect to /dashboard/owner
6. Email verification sent (optional)

#### Employee Onboarding Flow (Future)
1. HR sends invite via `/accounts/invite-employee/`
2. Employee receives email with invite link
3. Employee clicks link → `/auth/invite/[token]`
4. Shows pre-filled employee details
5. Employee creates password
6. Auto-login and redirect to `/dashboard`

## Security Implementation

### Multi-Tenancy Enforcement
- All queries filtered by `organization_id`
- Middleware validates tenant context
- API ensures user belongs to organization
- RLS policies in database (when using PostgreSQL)

### Permission Enforcement
- Decorators on Django views check permissions
- Frontend guards prevent unauthorized navigation
- API returns 403 Forbidden for unauthorized requests
- Audit logging captures all denied access attempts

### Session Management
- JWT tokens with organization scope
- Session invalidation on logout
- Permission refresh on login
- Cross-tenant access prevented

## Integration Points

### URLs Configuration (`server/core/urls.py`)
```
POST /api/auth/register-company/
POST /api/accounts/invite-employee/
POST /api/accounts/create-hr-user/
GET /api/accounts/my-organizations/
GET /api/navigation/menu/
```

### Frontend Routing
```
/auth/login - Enhanced login with auto-redirect
/auth/register-company - Company registration wizard
/dashboard/[role] - 10 role-specific dashboards
/access-denied - Permission denied page
```

## Testing Checklist

- [ ] Login with email returns correct dashboard route
- [ ] Login with employee_id works
- [ ] Login with username works
- [ ] Company registration creates organization
- [ ] Company owner role assigned correctly
- [ ] Tenant isolation enforced
- [ ] Each role sees correct navigation menu
- [ ] Permission guards block unauthorized access
- [ ] Audit logs capture all actions
- [ ] Multi-org user can switch organizations

## Next Steps

1. **Implement Employee Invitation Flow**
   - Invite token generation and validation
   - Onboarding page with pre-filled details
   - Email notifications

2. **Add Dashboard Widgets**
   - Recent activities feed
   - Quick action buttons
   - Real-time notifications
   - Custom metric widgets

3. **Implement Bulk Operations**
   - Bulk employee import from CSV
   - Bulk role assignment
   - Bulk actions (approve leaves, etc.)

4. **Add Search and Filtering**
   - Global search across employees, candidates, jobs
   - Advanced filtering per module
   - Saved search filters

5. **Performance Optimization**
   - Dashboard data caching
   - API response pagination
   - React query for data fetching
   - Lazy loading of dashboard sections

## Production Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Management command `init_rbac` executed
- [ ] Email service configured
- [ ] CORS properly configured
- [ ] JWT secrets configured
- [ ] Database backups tested
- [ ] Error logging configured
- [ ] Performance monitoring enabled
- [ ] Security headers configured
