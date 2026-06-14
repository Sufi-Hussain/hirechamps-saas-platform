# Frontend Testing Guide - Authentication & Role-Based Access

## Overview

This guide provides comprehensive testing procedures for the HireChamps frontend authentication system with JWT tokens and role-based access control.

## Quick Start

### 1. Start the Backend
```bash
cd server
python manage.py migrate
python manage.py init_rbac
python manage.py seed_demo_data
python manage.py runserver 0.0.0.0:8000
```

### 2. Start the Frontend
```bash
pnpm dev
```

### 3. Access the Testing Page
Open your browser and navigate to:
```
http://localhost:3000/test-login
```

This page will automatically test all 4 entity logins and display results.

---

## Test Accounts

### 1. Super Admin
- **URL**: `http://localhost:3000/auth/super-admin/login`
- **Email**: `super.admin@hirechamps.com`
- **Password**: `SuperAdmin@123`
- **Expected Role**: `platform_admin`
- **Expected Dashboard**: `/dashboard/platform-admin`
- **Capabilities**:
  - ✅ Manage all users
  - ✅ View audit logs
  - ✅ Manage payroll
  - ✅ Approve leaves
  - ✅ Platform-wide settings

### 2. Company Owner
- **URL**: `http://localhost:3000/auth/company-owner/login`
- **Email**: `owner@acmecorp.com`
- **Password**: `CompanyOwner@123`
- **Expected Role**: `company_owner`
- **Expected Dashboard**: `/dashboard/owner`
- **Capabilities**:
  - ✅ Manage organization
  - ✅ Invite users
  - ✅ View all org data
  - ✅ Manage payroll
  - ✅ Approve leaves

### 3. HR Manager
- **URL**: `http://localhost:3000/auth/hr-manager/login`
- **Email**: `hr@acmecorp.com`
- **Password**: `HRManager@123`
- **Expected Role**: `hr_manager`
- **Expected Dashboard**: `/dashboard/hr`
- **Capabilities**:
  - ✅ Manage employees
  - ✅ Manage leave requests
  - ✅ View org structure
  - ✅ Can approve leaves
  - ✅ Cannot manage payroll

### 4. Employee
- **URL**: `http://localhost:3000/auth/employee/login`
- **Email**: `john.doe@acmecorp.com`
- **Password**: `Employee@123`
- **Expected Role**: `employee`
- **Expected Dashboard**: `/dashboard`
- **Capabilities**:
  - ✅ View own profile
  - ✅ Request leaves
  - ✅ View own salary slips
  - ✅ Cannot manage users
  - ✅ Cannot manage payroll

---

## Testing Procedures

### Test 1: JWT Token Flow

**Objective**: Verify JWT tokens are generated and stored correctly

**Steps**:
1. Navigate to `http://localhost:3000/auth/employee/login`
2. Submit login form with demo credentials
3. Check browser localStorage:
   - Open DevTools → Application → LocalStorage
   - Verify `accessToken` key exists
   - Verify `refreshToken` key exists
4. Verify tokens are non-empty strings

**Expected Result**:
- Both tokens present in localStorage
- Access token is a valid JWT (3 parts separated by dots)
- Refresh token is a valid JWT (3 parts separated by dots)

---

### Test 2: Role-Based Dashboard Routing

**Objective**: Verify users are routed to correct dashboards based on role

**Steps**:
1. Login as Super Admin
   - Expected to redirect to `/dashboard/platform-admin`
2. Logout and login as Company Owner
   - Expected to redirect to `/dashboard/owner`
3. Logout and login as HR Manager
   - Expected to redirect to `/dashboard/hr`
4. Logout and login as Employee
   - Expected to redirect to `/dashboard`

**Expected Result**:
- Each role redirects to its specific dashboard
- Dashboard URL matches the backend's `dashboard_route` response

---

### Test 3: API Authorization Header

**Objective**: Verify JWT tokens are sent in API requests

**Steps**:
1. Login as any user
2. Open DevTools → Network tab
3. Click on any API request (e.g., when loading employees)
4. Check request headers for `Authorization` header
5. Verify format: `Authorization: Bearer <access_token>`

**Expected Result**:
- All authenticated API requests include `Authorization` header
- Header format is correct: `Bearer <token>`
- Token is the `accessToken` from localStorage

---

### Test 4: Token Refresh on 401

**Objective**: Verify automatic token refresh when access token expires

**Steps**:
1. Login and store tokens in localStorage
2. Manually delete the `accessToken` from localStorage (keep `refreshToken`)
3. Make an API request (open an employees list page)
4. Check Network tab for token refresh request
5. Verify new `accessToken` is generated

**Expected Result**:
- When access token is missing/expired, system calls `/api/token/refresh/`
- New access token is generated and stored in localStorage
- Original API request is retried with new token
- If refresh fails, user is redirected to `/auth`

---

### Test 5: Role-Based Permissions

**Objective**: Verify users have correct permissions based on role

**Steps**:
1. Login as Employee
   - Check localStorage for `auth-store` (via console)
   - Verify `permissions` array contains employee-level permissions
   - Verify `canManageUsers` is false
   - Verify `canManagePayroll` is false
2. Logout and login as HR Manager
   - Verify `permissions` array contains HR permissions
   - Verify `canApproveLeaves` is true
3. Logout and login as Super Admin
   - Verify `permissions` array contains all permissions
   - Verify all capability flags are true

**Expected Result**:
- Each role has correct set of permissions
- Capability flags match role capabilities
- Backend response includes all permission codes

---

### Test 6: User Profile Data

**Objective**: Verify user profile information is correctly stored

**Steps**:
1. Login as any user
2. Check localStorage for `auth-store` via browser console:
   ```javascript
   localStorage.getItem('auth-store')
   ```
3. Parse JSON and verify user object contains:
   - `id` (UUID)
   - `email`
   - `first_name`
   - `last_name`
   - `role`
   - `organization` (object with id, name, slug)

**Expected Result**:
- User object fully populated with correct data
- All fields match backend response
- Organization data correctly stored

---

### Test 7: Create New Account

**Objective**: Verify company registration flow

**Steps**:
1. Navigate to `http://localhost:3000/auth/company-owner/register`
2. Fill in registration form:
   - Company Name: `Test Company Ltd`
   - Owner Email: `testowner@test.com`
   - Owner Name: `Test Owner`
   - Password: `TestPassword@123`
3. Submit form
4. Verify success message or error handling
5. Try to login with new credentials

**Expected Result**:
- Company created in database
- Company owner account created
- Can login with new credentials
- User is routed to `/dashboard/owner`

---

### Test 8: Logout Flow

**Objective**: Verify logout clears tokens and session

**Steps**:
1. Login as any user
2. Click logout button (check navigation menu)
3. Verify redirect to `/auth`
4. Check localStorage:
   - `accessToken` should be removed
   - `refreshToken` should be removed
   - `user` should be removed
   - `auth-store` should be cleared
5. Try to access protected page (e.g., `/dashboard`)
   - Should redirect to `/auth`

**Expected Result**:
- All tokens cleared from localStorage
- Auth store cleared
- User redirected to login page
- Cannot access protected pages

---

### Test 9: Session Persistence

**Objective**: Verify session persists across page refreshes

**Steps**:
1. Login as Employee
2. Refresh the page (F5)
3. Verify still logged in and on dashboard
4. Check localStorage still has tokens
5. Close browser tab and reopen without clearing localStorage
6. Navigate to `http://localhost:3000/dashboard`
7. Verify logged in and dashboard loads

**Expected Result**:
- Session persists across page refreshes
- Tokens remain in localStorage
- User stays logged in
- No need to re-login within token lifetime

---

## Automated Testing

### Running the Test Suite

1. Navigate to `http://localhost:3000/test-login`
2. Click "Run All Tests" button
3. Wait for all tests to complete

The test page will:
- Login with all 4 test accounts
- Verify JWT tokens in response
- Check role and permissions
- Verify dashboard routes
- Display detailed results for each account

---

## Role-Based Feature Access Testing

### Features by Role

#### Super Admin Only
- Platform settings
- Manage all organizations
- View all audit logs
- Manage global RBAC roles
- View system health

#### Company Owner Only
- Organization settings
- Invite employees
- Manage departments
- View organization audit logs
- Manage payroll configuration

#### HR Manager Only
- Manage employee profiles
- Approve/reject leave requests
- View attendance records
- Generate HR reports
- Manage leave policies

#### Employee Only
- View own profile
- Request leaves
- View own salary slips
- View own training enrollments
- Update personal information

---

## Debugging

### Check Auth Store State

```javascript
// In browser console
import { useAuthStore } from '@/lib/store'
const state = useAuthStore.getState()
console.log('Current User:', state.user)
console.log('Roles:', state.roles)
console.log('Permissions:', state.permissions)
console.log('Tokens:', {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken')
})
```

### Check API Requests

1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Click on any API request
4. Check:
   - Request headers for Authorization
   - Response status code
   - Response body for data/errors

### Common Issues

**Issue**: Login fails with "Invalid credentials"
- **Solution**: Verify test account exists in database
- **Check**: Run `python manage.py seed_demo_data`

**Issue**: Tokens not stored in localStorage
- **Solution**: Check browser allows localStorage
- **Check**: Open DevTools and manually verify localStorage

**Issue**: 401 error on protected endpoints
- **Solution**: Verify tokens are valid and not expired
- **Check**: Tokens in localStorage match API response

**Issue**: Cannot refresh token
- **Solution**: Verify `/api/token/refresh/` endpoint exists
- **Check**: Backend has SimpleJWT configured

---

## Performance Testing

### Measure API Response Times

1. Open DevTools → Network tab
2. Login and perform actions
3. Check response times for:
   - `/api/auth/login/` should be < 500ms
   - `/api/users/` should be < 1000ms
   - `/api/employees/` should be < 2000ms

---

## Conclusion

Once all tests pass, the authentication system is ready for production. Make sure to:

1. ✅ Test all 4 entity logins
2. ✅ Verify JWT token generation and storage
3. ✅ Check role-based routing
4. ✅ Verify API authentication headers
5. ✅ Test token refresh on expiration
6. ✅ Verify permission checking
7. ✅ Test account creation
8. ✅ Test logout flow
9. ✅ Verify session persistence

---

## Next Steps

Once testing is complete:

1. Create role-based dashboards for each entity type
2. Implement feature-level access control
3. Add role-based menu items
4. Create admin panel for RBAC management
5. Set up monitoring for failed login attempts
6. Configure email notifications for account creation

