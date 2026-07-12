# API Integration Guide for HRMS Frontend

## Overview
This guide provides step-by-step instructions for integrating backend API endpoints with the HRMS frontend.

---

## 1. API Client Setup

### Status: ✅ COMPLETE

The API client is already configured in `lib/api.ts`:

```typescript
import api from '@/lib/api'
```

Features:
- Base URL from `NEXT_PUBLIC_API_URL`
- JWT token in Authorization header
- Automatic token refresh on 401
- Request/response interceptors
- Error handling

### Environment Setup
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 2. Using API Service Helpers

### Basic Usage

All API calls use `api` client with helpers in `apiService`:

```typescript
import { apiService } from '@/lib/api'

// Example: Get users
const users = await apiService.getUsers()

// Example: Create employee
const employee = await apiService.createEmployee(data)
```

### Common Patterns

#### GET with Pagination & Filtering
```typescript
const response = await api.get('/employees/', {
  params: {
    page: 1,
    search: 'John',
    status: 'active'
  }
})
```

#### POST with Data
```typescript
const response = await api.post('/employees/', {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com'
})
```

#### File Download
```typescript
const response = await api.get(`/payroll/payslips/${id}/download/`, {
  responseType: 'blob'
})
const url = window.URL.createObjectURL(new Blob([response.data]))
```

---

## 3. Authentication Flow Integration

### Status: ✅ COMPLETE

#### Login
Already implemented in `/app/auth/login/page.tsx`:
```typescript
const { login } = useAuthStore()
await login(email, password, organizationId)
```

Backend response should include:
```json
{
  "access_token": "token",
  "refresh_token": "token",
  "user": { "id", "email", "first_name", "last_name", "role" },
  "organization": { "id", "name", "slug" },
  "permissions": ["..."],
  "roles": ["..."],
  "dashboard_route": "/dashboard/employee",
  "capabilities": { "can_manage_users": true }
}
```

#### Auto Restore
Automatic on app init via `AuthProvider` in `app/layout-wrapper.tsx`.

Calls `/auth/me/` to verify token.

#### Token Refresh
Automatic on 401 response. Uses `refreshToken` from `POST /auth/refresh/`.

---

## 4. Page-by-Page Integration

### Employee Portal

#### Profile (`/dashboard/employee/profile`)

**Current State:** Ready for API integration
**Todo:**
1. Update `handleSave` to call API:
   ```typescript
   const response = await api.put(`/users/${user?.id}/`, formData)
   ```

2. Backend endpoint: `PATCH /users/{id}/`
   - Accept: first_name, last_name, phone, profile_image_url
   - Response: Updated user object

#### Payslips (`/dashboard/employee/payslips`)

**Current State:** API calls implemented
**Verify:**
1. GET `/payroll/payslips/` returns array of payslips
   ```json
   {
     "id": "uuid",
     "month": "2024-03",
     "gross_salary": 50000,
     "net_salary": 45000,
     "status": "generated|sent|viewed|downloaded",
     "created_at": "2024-03-01T00:00:00Z"
   }
   ```

2. GET `/payroll/payslips/{id}/download/` returns PDF blob

#### Attendance (`/dashboard/employee/attendance`)

**Current State:** Ready for API integration
**Verify:**
1. GET `/employees/attendance/` with params:
   ```
   ?month=2024-03&employee_id=...
   ```
   Returns:
   ```json
   {
     "records": [
       {
         "date": "2024-03-01",
         "status": "present|absent|half_day|leave",
         "check_in": "09:00",
         "check_out": "18:00"
       }
     ],
     "stats": {
       "present": 20,
       "absent": 2,
       "leaves": 3,
       "total": 25
     }
   }
   ```

### Employee Management (`/dashboard/employees`)

**Current State:** Basic implementation exists
**Integrate:**
1. Verify GET `/employees/?page=1&search=...&status=...` returns:
   ```json
   {
     "count": 100,
     "next": "url",
     "previous": null,
     "results": [
       {
         "id": "uuid",
         "employee_id": "EMP001",
         "user": { "first_name", "last_name", "email" },
         "department": "id",
         "designation": "id",
         "status": "active"
       }
     ]
   }
   ```

2. POST `/employees/` for creating new employee

### HR Dashboard (`/dashboard/hr`)

**Current State:** Component structure exists
**Todo:**
1. Connect API endpoints:
   - GET `/dashboard/hr/stats/` - KPI stats
   - GET `/employees/` - Employee list
   - GET `/leave-requests/` - Pending leaves
   - GET `/announcements/` - Company announcements

### Leave Management (`/dashboard/leave`)

**Endpoints:**
- GET `/leave-requests/` - List requests (paginated)
- POST `/leave-requests/` - Create request
- POST `/leave-requests/{id}/approve/` - Approve
- POST `/leave-requests/{id}/reject/` - Reject with reason
- GET `/leave-types/` - Available leave types
- GET `/leave-balances/my_balance/` - User balance

### Payroll Module (`/dashboard/payroll/*`)

**Already implemented** - See PAYROLL_API_SPECIFICATION.md

### Settings (`/dashboard/settings`)

**Todo:**
1. Connect organization settings API
2. User profile update
3. Password change

---

## 5. SWR Data Fetching Integration

### Current Pattern

```typescript
import useSWR from 'swr'
import api from '@/lib/api'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

// In component
const { data, mutate, isLoading, error } = useSWR('/employees/', fetcher)
```

### Should Replace With SWR

Pages currently using direct api calls should migrate to SWR for:
- Caching
- Automatic revalidation
- Optimistic updates
- Deduplicated requests

---

## 6. Error Handling Pattern

### Current Pattern

```typescript
try {
  const response = await api.get('/endpoint')
  setData(response.data)
} catch (err: any) {
  setError(err.response?.data?.detail || err.message)
}
```

### Standardize Response Format

Backend should return consistent error format:
```json
{
  "detail": "Error message",
  "errors": {
    "field_name": ["Error for field"]
  }
}
```

---

## 7. Common Data Structures

### User Object
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "employee|hr|admin|payroll_manager|manager",
  "phone": "1234567890",
  "profile_image_url": "https://...",
  "is_verified": true,
  "organization_id": "uuid"
}
```

### Employee Object
```json
{
  "id": "uuid",
  "employee_id": "EMP001",
  "user_id": "uuid",
  "user": { ...user },
  "department_id": "uuid",
  "designation_id": "uuid",
  "status": "active|on_leave|terminated",
  "employment_type": "full_time|part_time|contract",
  "date_of_joining": "2024-01-01",
  "phone": "1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "M|F|Other",
  "marital_status": "Single|Married"
}
```

### Pagination Response
```json
{
  "count": 100,
  "next": "http://api.example.com/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## 8. Testing the Integration

### Test Authentication
1. Go to `/auth/login`
2. Enter credentials
3. Should redirect to dashboard based on role
4. Refresh page - should stay logged in
5. Check console - no auth errors

### Test RBAC
1. Login as different roles
2. Verify correct dashboard shown
3. Check sidebar - only relevant modules visible
4. Try to access unauthorized page - should redirect to /access-denied

### Test Employee Portal
1. Login as employee
2. Go to `/dashboard/employee/profile`
3. Should load profile data
4. Go to `/dashboard/employee/payslips`
5. Should show payslips list
6. Go to `/dashboard/employee/attendance`
7. Should show attendance records

### Test API Calls
1. Open browser DevTools
2. Network tab
3. Try each page action
4. Verify API calls return data
5. Check Authorization header includes token

---

## 9. Troubleshooting

### 401 Unauthorized
- Check if token is in localStorage
- Check if Authorization header is set
- Verify token is not expired
- Check token refresh is working

### CORS Errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS config includes frontend origin
- Verify credentials are being sent (withCredentials: true)

### API Returns 404
- Verify endpoint path is correct
- Check backend routes are registered
- Verify tenant/organization context

### Data Not Loading
- Check network tab for failed requests
- Verify API returns correct structure
- Check loading state is handled
- Look for error messages in console

---

## 10. Integration Checklist

### Authentication
- [ ] Login works and sets tokens
- [ ] Token persists across refreshes
- [ ] Token refresh works on 401
- [ ] Logout clears session
- [ ] /auth/me/ returns current user

### RBAC
- [ ] Users have roles from backend
- [ ] Users have permissions from backend
- [ ] Dashboard routed based on role
- [ ] Navigation filtered by role
- [ ] Protected pages enforce RBAC

### Employee Portal
- [ ] Profile loads and saves
- [ ] Payslips list and download
- [ ] Attendance shows records
- [ ] All API calls working

### Data Management
- [ ] GET endpoints return data
- [ ] POST endpoints create records
- [ ] PATCH endpoints update records
- [ ] DELETE endpoints remove records
- [ ] Pagination works
- [ ] Filtering works
- [ ] Search works

### Error Handling
- [ ] Error messages display
- [ ] Loading states shown
- [ ] Empty states handled
- [ ] Network errors caught
- [ ] 401/403 handled properly

---

## 11. Performance Tips

### Implement Caching
```typescript
const { data } = useSWR(url, fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000 // 1 minute
})
```

### Lazy Load Routes
Already setup with Next.js dynamic imports.

### Optimize API Calls
- Don't call same endpoint twice in one render
- Use SWR for automatic caching
- Batch requests when possible
- Implement pagination

---

## 12. Security Checklist

- [ ] Tokens stored securely (httpOnly cookies for production)
- [ ] HTTPS enforced in production
- [ ] CORS properly configured
- [ ] No sensitive data in localStorage
- [ ] API validates user permissions
- [ ] Rate limiting implemented
- [ ] CSRF protection enabled

---

## Conclusion

The frontend is ready for backend API integration. Follow the patterns outlined in this guide to connect endpoints, and use the checklists to verify everything works correctly.

For questions, refer to:
- `lib/api.ts` - API client implementation
- `lib/store.ts` - Auth store
- `components/providers/AuthProvider.tsx` - Auth initialization
- Existing pages for reference implementations

