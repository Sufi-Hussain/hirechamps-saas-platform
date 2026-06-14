# Quick Testing Reference Card

## Automated Testing

### Quick Test All Logins
```
http://localhost:3000/test-login
→ Click "Run All Tests"
→ View results for all 4 entities
```

---

## Manual Testing - Demo Accounts

### Super Admin
```
URL:      http://localhost:3000/auth/super-admin/login
Email:    super.admin@hirechamps.com
Password: SuperAdmin@123
Role:     platform_admin
Dashboard: /dashboard/platform-admin
```

### Company Owner
```
URL:      http://localhost:3000/auth/company-owner/login
Email:    owner@acmecorp.com
Password: CompanyOwner@123
Role:     company_owner
Dashboard: /dashboard/owner
```

### HR Manager
```
URL:      http://localhost:3000/auth/hr-manager/login
Email:    hr@acmecorp.com
Password: HRManager@123
Role:     hr_manager
Dashboard: /dashboard/hr
```

### Employee
```
URL:      http://localhost:3000/auth/employee/login
Email:    john.doe@acmecorp.com
Password: Employee@123
Role:     employee
Dashboard: /dashboard
```

---

## Verification Checklist

### After Each Login, Check:

**1. Tokens in Browser**
```javascript
// Console
localStorage.getItem('accessToken')    // Should be non-empty JWT
localStorage.getItem('refreshToken')   // Should be non-empty JWT
```

**2. Auth Store**
```javascript
// Console
const state = localStorage.getItem('auth-store')
JSON.parse(state).state.user            // User data
JSON.parse(state).state.roles           // [role1, role2, ...]
JSON.parse(state).state.permissions     // [perm1, perm2, ...]
```

**3. Correct Dashboard**
```
Check URL after login redirects to:
- Super Admin → /dashboard/platform-admin
- Company Owner → /dashboard/owner
- HR Manager → /dashboard/hr
- Employee → /dashboard
```

**4. API Authorization**
```
DevTools → Network tab → Any API call
Check Headers → Authorization: Bearer <token>
```

**5. Role Capabilities**
```javascript
// Console - Check based on role
const state = JSON.parse(localStorage.getItem('auth-store')).state
console.log(state.canManageUsers)       // Role capability
console.log(state.canManagePayroll)     // Role capability
console.log(state.canApproveLeaves)     // Role capability
console.log(state.canViewAuditLogs)     // Role capability
```

---

## API Endpoints to Test

### Login (No Auth Required)
```
POST http://localhost:8000/api/auth/login/
{
  "credential": "email@example.com",
  "password": "password"
}
```

### Get Current User (Auth Required)
```
GET http://localhost:8000/api/auth/me/
Authorization: Bearer <access_token>
```

### Refresh Token (No Auth Required)
```
POST http://localhost:8000/api/token/refresh/
{
  "refresh": "<refresh_token>"
}
```

### Get Employees (Auth Required)
```
GET http://localhost:8000/api/employees/
Authorization: Bearer <access_token>
```

---

## Expected Role Permissions

### platform_admin (Super Admin)
- ✅ All permissions
- ✅ Can manage all users
- ✅ Can view audit logs
- ✅ Can manage payroll
- ✅ Can approve leaves

### company_owner (Company Owner)
- ✅ employees.view, employees.create, employees.edit
- ✅ can_manage_payroll: true
- ✅ can_approve_leaves: true
- ❌ can_manage_users: false (org-level only)
- ❌ can_view_audit_logs: false

### hr_manager (HR Manager)
- ✅ employees.view, employees.create, employees.edit
- ✅ leave_requests.approve
- ✅ can_approve_leaves: true
- ❌ can_manage_payroll: false
- ❌ can_manage_users: false

### employee (Employee)
- ✅ leave_requests.create (own)
- ✅ attendance.view (own)
- ✅ salary_slips.view (own)
- ❌ can_manage_users: false
- ❌ can_manage_payroll: false
- ❌ can_approve_leaves: false

---

## Frontend Updates Applied

✅ API layer updated with JWT token handling
✅ Axios interceptors configured for token refresh
✅ Auth store updated for new token format
✅ All 4 login pages updated with new flow
✅ Testing page created for verification
✅ Token persistence to localStorage
✅ Automatic token refresh on 401

---

## Common Commands

### Backend Setup
```bash
cd server
python manage.py migrate
python manage.py init_rbac
python manage.py seed_demo_data
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup
```bash
pnpm install
pnpm dev
```

### Clear LocalStorage (Browser Console)
```javascript
localStorage.clear()
location.reload()
```

### Check All Stored Data (Browser Console)
```javascript
console.log('accessToken:', localStorage.getItem('accessToken'))
console.log('refreshToken:', localStorage.getItem('refreshToken'))
console.log('user:', JSON.parse(localStorage.getItem('user')))
console.log('auth-store:', JSON.parse(localStorage.getItem('auth-store')))
```

---

## Testing Success Criteria

- [ ] All 4 test accounts can login
- [ ] JWT tokens generated and stored
- [ ] Users routed to correct dashboards
- [ ] API calls include Authorization header
- [ ] Permissions and roles match backend
- [ ] Logout clears all auth data
- [ ] Session persists across refresh
- [ ] Token refresh works on 401

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Login fails | Check seed_demo_data ran successfully |
| No tokens | Check backend returns access_token in response |
| 401 errors | Verify Authorization header in requests |
| Wrong dashboard | Check dashboard_route in login response |
| Permissions empty | Run init_rbac management command |
| Session lost | Check localStorage not cleared by browser |

---

## Performance Baselines

| Endpoint | Expected | Actual |
|----------|----------|--------|
| Login | < 500ms | - |
| Get Employees | < 1000ms | - |
| Get Users | < 1000ms | - |
| Token Refresh | < 200ms | - |

---

## Testing Checklist Summary

```
Test Page: http://localhost:3000/test-login
├─ Super Admin Login ☐
├─ Company Owner Login ☐
├─ HR Manager Login ☐
├─ Employee Login ☐
├─ Token Storage ☐
├─ Dashboard Routing ☐
├─ API Authorization ☐
├─ Token Refresh ☐
├─ Logout Flow ☐
└─ Session Persistence ☐
```

---

Last Updated: 2024
Status: Ready for Testing
