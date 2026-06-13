# HireChamps: Quick Start Guide

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  10 Role-Based Dashboards + Auth Flows             │  │
│  │  - Login with Multi-Credential Support             │  │
│  │  - Company Registration Wizard                      │  │
│  │  - Role-Specific Navigation                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Django)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  RBAC Engine + Account Workflows                    │  │
│  │  - Permission Checking                              │  │
│  │  - Role Assignment                                  │  │
│  │  - Tenant Isolation                                 │  │
│  │  - Audit Logging                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              Database (PostgreSQL/MySQL)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Multi-Tenant Data with RLS Policies               │  │
│  │  - Organization Isolation                           │  │
│  │  - User & Role Data                                 │  │
│  │  - Audit Trails                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Getting Started (5 Minutes)

### 1. Backend Setup

```bash
# Run migrations
python manage.py migrate

# Initialize RBAC system
python manage.py init_rbac

# Create superuser for platform admin
python manage.py createsuperuser
```

### 2. Start Backend Server

```bash
python manage.py runserver 8000
```

### 3. Frontend Setup

```bash
# Install dependencies (if needed)
pnpm install

# Start frontend dev server
pnpm dev
```

### 4. Test the System

#### Create Organization via API
```bash
curl -X POST http://localhost:8000/api/auth/register-company/ \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Acme Corp",
    "domain": "acmecorp",
    "country": "IN",
    "owner_email": "owner@acmecorp.com",
    "owner_password": "SecurePass123!"
  }'
```

#### Login to Frontend
- Visit: http://localhost:3000/auth/login
- Use: `owner@acmecorp.com` / `SecurePass123!`
- Redirects to: http://localhost:3000/dashboard/owner

## Role-Based Access Flows

### User Journey: New Company Owner
```
1. Navigate to /auth/register-company
2. Enter company info (name, domain, country)
3. Enter owner details (name, email)
4. Create password
5. Click "Create Company & Login"
6. Redirected to /dashboard/owner
7. See organization overview
```

### User Journey: HR Manager
```
1. Admin invites HR manager via /api/accounts/create-hr-user/
2. HR manager receives email
3. Logs in with credentials
4. Redirected to /dashboard/hr
5. Can manage employees, leave, attendance
```

### User Journey: Regular Employee
```
1. HR invites via /api/accounts/invite-employee/
2. Employee receives invite email
3. Clicks link to /auth/invite/[token]
4. Creates password
5. Redirected to /dashboard
6. Sees personal leave, attendance, training
```

## Dashboard Routes (Auto-Routing Based on Role)

```
Platform Admin    → /dashboard/platform-admin
Company Owner     → /dashboard/owner
Tenant Admin      → /dashboard/admin
HR Manager        → /dashboard/hr
Payroll Manager   → /dashboard/payroll
Recruiter         → /dashboard/recruitment
Department Mgr    → /dashboard/department
Learning Manager  → /dashboard/learning
Employee          → /dashboard
Auditor           → /dashboard/audit
```

## Key Features to Test

### 1. Multi-Credential Login
```bash
# Try logging in with any of:
- Email: owner@acmecorp.com
- Username: owner@acmecorp.com
- Employee ID: EMP001 (if applicable)
```

### 2. Permission Enforcement
```bash
# Unauthorized access returns 403
curl -X GET http://localhost:8000/api/audit-logs/ \
  -H "Authorization: Bearer <token>" \
  # Returns 403 unless user has audit permission
```

### 3. Tenant Isolation
```bash
# User can only see their organization's data
# Attempting to access other org's data returns 403
```

### 4. Audit Trail
```bash
# Every action is logged
GET /api/audit-logs/ # See all actions in organization
GET /api/audit-logs/?user_id=123 # Filter by user
```

## API Endpoints Quick Reference

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login/` | Login with credentials |
| POST | `/api/auth/logout/` | Logout user |
| GET | `/api/auth/me/` | Get current user info |
| POST | `/api/auth/register-company/` | Self-service registration |

### Account Management
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/accounts/invite-employee/` | Invite employee |
| POST | `/api/accounts/create-hr-user/` | Create HR manager |
| GET | `/api/accounts/my-organizations/` | List user's orgs |

### Navigation
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/navigation/menu/` | Get role-based menu |

### Data Operations
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/employees/` | List employees |
| POST | `/api/leave-requests/` | Create leave request |
| GET | `/api/audit-logs/` | View audit logs |
| ... | ... | [All other modules] |

## Troubleshooting

### Login Not Redirecting to Dashboard
- Check browser console for errors
- Verify `dashboard_route` in login response
- Clear browser cache and try again

### Permission Denied Errors
- Verify user has required role
- Check role permissions in admin panel
- Review audit logs for denied access

### Organization Not Visible
- Ensure user is assigned to organization
- Check `User.organization` field
- Verify organization exists in database

### Audit Logs Empty
- Check if action was logged
- Verify organization context is set
- Look for errors in backend logs

## Admin Panel Access

### Django Admin
```
URL: http://localhost:8000/admin
Username: [superuser created during setup]
Password: [superuser password]
```

### Manage:
- Users and roles
- Organizations
- Permissions
- Audit logs
- All modules (employees, leave, payroll, etc.)

## Performance Tips

1. **Use Role-Based Queries**
   - Filter by role to show relevant menu items
   - Only load data user can access

2. **Cache Navigation Menu**
   - Store menu in Zustand store
   - Refresh on permission change only

3. **Paginate Audit Logs**
   - Load 10 items per page by default
   - Implement infinite scroll

4. **Index Database Properly**
   - Index `organization_id`, `user_id`
   - Index audit log queries

## Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Set DEBUG = False
- [ ] Configure ALLOWED_HOSTS
- [ ] Use HTTPS in production
- [ ] Set secure cookies flags
- [ ] Configure CORS properly
- [ ] Enable CSRF protection
- [ ] Use strong password requirements
- [ ] Configure rate limiting
- [ ] Set up email verification

## Next Steps

1. **Customize Dashboards**
   - Add your own widgets
   - Integrate real data queries
   - Add charts and graphs

2. **Implement Invitations**
   - Add email notifications
   - Create invite token system
   - Build acceptance flow

3. **Add Bulk Operations**
   - CSV employee import
   - Bulk role assignment
   - Batch actions

4. **Monitor & Optimize**
   - Set up error tracking
   - Add performance monitoring
   - Configure logging

## Support & Documentation

- See `RBAC_IMPLEMENTATION.md` for detailed RBAC docs
- See `DASHBOARDS_AND_AUTH_FLOWS.md` for auth flow docs
- Check `BUILD_SUMMARY.md` for what was built
- Review `DASHBOARDS_AND_AUTH_FLOWS.md` for testing guide

---

**Ready to deploy?** Follow the "Production Deployment Checklist" in `DASHBOARDS_AND_AUTH_FLOWS.md`
