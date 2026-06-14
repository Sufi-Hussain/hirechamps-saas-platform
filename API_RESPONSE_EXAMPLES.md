# API Response Examples

## Authentication Responses

### Login - Super Admin

**Request:**
```json
POST /api/auth/login/
{
  "credential": "super.admin@hirechamps.com",
  "password": "SuperAdmin@123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4NjQ5MjAwLCJpYXQiOjE3MTg2NDU2MDAsImp0aSI6ImUwYTk5OWU3MDcwYjQwYTI5MzljZTA4ZWI1MzNkNzk3IiwidXNlcl9pZCI6InV1aWQtaGVyZSJ9.signature",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxOTI1MDQwMCwiaWF0IjoxNzE4NjQ1NjAwLCJqdGkiOiJmMzJhMDAwYzQ4ZTQ0OTg1YjQwOTAyMzE1N2Y3YzUxNyIsInVzZXJfaWQiOiJ1dWlkLWhlcmUifQ.signature",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "super.admin@hirechamps.com",
    "first_name": "Super",
    "last_name": "Admin",
    "role": "admin",
    "organization": "00000000-0000-0000-0000-000000000001",
    "is_verified": true,
    "profile_image_url": ""
  },
  "permissions": [
    "employees.view",
    "employees.create",
    "employees.edit",
    "employees.delete",
    "leave.view",
    "leave.create",
    "leave.approve",
    "leave.edit",
    "attendance.view",
    "attendance.create",
    "attendance.edit",
    "payroll.view",
    "payroll.create",
    "payroll.edit",
    "payroll.approve",
    "recruitment.view",
    "recruitment.create",
    "recruitment.edit",
    "recruitment.delete",
    "learning.view",
    "learning.create",
    "learning.edit",
    "learning.delete",
    "reports.view",
    "organization.view",
    "organization.edit",
    "departments.view",
    "departments.create",
    "departments.edit",
    "designations.view",
    "designations.create",
    "designations.edit"
  ],
  "roles": [
    "platform_admin"
  ],
  "dashboard_route": "/dashboard/platform-admin",
  "organization": {
    "id": "00000000-0000-0000-0000-000000000001",
    "name": "HireChamps Platform",
    "slug": "hirechamps-platform"
  },
  "can_manage_users": true,
  "can_manage_payroll": true,
  "can_approve_leaves": true,
  "can_view_audit_logs": true
}
```

---

### Login - Company Owner

**Request:**
```json
POST /api/auth/login/
{
  "credential": "owner@acmecorp.com",
  "password": "CompanyOwner@123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "223e4567-e89b-12d3-a456-426614174000",
    "email": "owner@acmecorp.com",
    "first_name": "Acme",
    "last_name": "Owner",
    "role": "admin",
    "organization": "00000000-0000-0000-0000-000000000002",
    "is_verified": true,
    "profile_image_url": ""
  },
  "permissions": [
    "employees.view",
    "employees.create",
    "employees.edit",
    "employees.delete",
    "leave.view",
    "leave.approve",
    "attendance.view",
    "payroll.view",
    "payroll.create",
    "payroll.edit",
    "payroll.approve",
    "reports.view",
    "organization.view",
    "organization.edit",
    "departments.view",
    "departments.create",
    "departments.edit",
    "designations.view",
    "designations.create",
    "designations.edit"
  ],
  "roles": [
    "company_owner"
  ],
  "dashboard_route": "/dashboard/owner",
  "organization": {
    "id": "00000000-0000-0000-0000-000000000002",
    "name": "Acme Corporation",
    "slug": "acme-corporation"
  },
  "can_manage_users": false,
  "can_manage_payroll": true,
  "can_approve_leaves": true,
  "can_view_audit_logs": false
}
```

---

### Login - HR Manager

**Request:**
```json
POST /api/auth/login/
{
  "credential": "hr@acmecorp.com",
  "password": "HRManager@123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "323e4567-e89b-12d3-a456-426614174000",
    "email": "hr@acmecorp.com",
    "first_name": "HR",
    "last_name": "Manager",
    "role": "hr",
    "organization": "00000000-0000-0000-0000-000000000002",
    "is_verified": true,
    "profile_image_url": ""
  },
  "permissions": [
    "employees.view",
    "employees.create",
    "employees.edit",
    "leave.view",
    "leave.create",
    "leave.approve",
    "attendance.view",
    "attendance.create",
    "attendance.edit",
    "reports.view",
    "departments.view",
    "designations.view"
  ],
  "roles": [
    "hr_manager"
  ],
  "dashboard_route": "/dashboard/hr",
  "organization": {
    "id": "00000000-0000-0000-0000-000000000002",
    "name": "Acme Corporation",
    "slug": "acme-corporation"
  },
  "can_manage_users": false,
  "can_manage_payroll": false,
  "can_approve_leaves": true,
  "can_view_audit_logs": false
}
```

---

### Login - Employee

**Request:**
```json
POST /api/auth/login/
{
  "credential": "john.doe@acmecorp.com",
  "password": "Employee@123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "423e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@acmecorp.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "employee",
    "organization": "00000000-0000-0000-0000-000000000002",
    "is_verified": true,
    "profile_image_url": "https://example.com/profiles/john.jpg"
  },
  "permissions": [
    "employees.view",
    "leave.view",
    "leave.create",
    "attendance.view",
    "reports.view"
  ],
  "roles": [
    "employee"
  ],
  "dashboard_route": "/dashboard",
  "organization": {
    "id": "00000000-0000-0000-0000-000000000002",
    "name": "Acme Corporation",
    "slug": "acme-corporation"
  },
  "can_manage_users": false,
  "can_manage_payroll": false,
  "can_approve_leaves": false,
  "can_view_audit_logs": false
}
```

---

### Login - Failed Authentication

**Request:**
```json
POST /api/auth/login/
{
  "credential": "invalid@example.com",
  "password": "WrongPassword"
}
```

**Response (401 Unauthorized):**
```json
{
  "detail": "Invalid credentials. Please check your email/username and password."
}
```

---

## Token Refresh

### Token Refresh Request

**Request:**
```json
POST /api/token/refresh/
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4NjQ5OTAwLCJpYXQiOjE3MTg2NDYzMDAsImp0aSI6IjEyMzQ1Njc4OTAiLCJ1c2VyX2lkIjoiNDIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwIn0.signature",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxOTI1MDQwMCwiaWF0IjoxNzE4NjQ2MzAwLCJqdGkiOiJhYmNkZWYxMjM0NTYiLCJ1c2VyX2lkIjoiNDIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwIn0.signature"
}
```

---

### Token Refresh - Failed

**Request:**
```json
POST /api/token/refresh/
{
  "refresh": "invalid_or_expired_token"
}
```

**Response (401 Unauthorized):**
```json
{
  "detail": "Token is invalid or expired"
}
```

---

## Get Current User

### Request

**Request:**
```
GET /api/auth/me/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "id": "423e4567-e89b-12d3-a456-426614174000",
  "email": "john.doe@acmecorp.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "employee",
  "organization": "00000000-0000-0000-0000-000000000002",
  "is_verified": true,
  "profile_image_url": "https://example.com/profiles/john.jpg"
}
```

---

### Unauthorized Request

**Request (no token):**
```
GET /api/auth/me/
```

**Response (401 Unauthorized):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Protected API Endpoints

### Get Employees

**Request:**
```
GET /api/employees/?page=1&page_size=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/employees/?page=2",
  "previous": null,
  "results": [
    {
      "id": "emp-001",
      "user": {
        "id": "423e4567-e89b-12d3-a456-426614174000",
        "email": "john.doe@acmecorp.com",
        "first_name": "John",
        "last_name": "Doe"
      },
      "employee_id": "EMP001",
      "designation": "Software Engineer",
      "department": "Engineering",
      "joining_date": "2023-01-15",
      "status": "active"
    }
  ]
}
```

---

### Get Leave Requests (Pending)

**Request:**
```
GET /api/leave-requests/?status=pending
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "count": 3,
  "results": [
    {
      "id": "leave-001",
      "user": {
        "id": "423e4567-e89b-12d3-a456-426614174000",
        "email": "john.doe@acmecorp.com",
        "first_name": "John",
        "last_name": "Doe"
      },
      "leave_type": "Sick Leave",
      "start_date": "2024-06-20",
      "end_date": "2024-06-22",
      "reason": "Medical appointment",
      "status": "pending",
      "created_at": "2024-06-15T10:30:00Z"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Invalid request data",
  "errors": {
    "password": ["Password must be at least 8 characters long"]
  }
}
```

### 403 Forbidden (Permission Denied)

```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found

```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error

```json
{
  "detail": "Internal server error. Please try again later."
}
```

---

## Frontend Storage Format

### localStorage after login:

```javascript
// accessToken
localStorage.setItem('accessToken', 'eyJhbGciOiJIUzI1NiIs...')

// refreshToken
localStorage.setItem('refreshToken', 'eyJhbGciOiJIUzI1NiIs...')

// user
localStorage.setItem('user', JSON.stringify({
  id: '423e4567-e89b-12d3-a456-426614174000',
  email: 'john.doe@acmecorp.com',
  first_name: 'John',
  last_name: 'Doe',
  role: 'employee',
  organization: '00000000-0000-0000-0000-000000000002'
}))

// auth-store (from Zustand persist middleware)
localStorage.setItem('auth-store', JSON.stringify({
  state: {
    user: { ... },
    organization: { ... },
    accessToken: 'eyJhbGciOiJIUzI1NiIs...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
    roles: ['employee'],
    permissions: ['employees.view', 'leave.view', 'leave.create', ...],
    dashboardRoute: '/dashboard',
    canManageUsers: false,
    canManagePayroll: false,
    canApproveLeaves: false,
    canViewAuditLogs: false
  },
  version: 0
}))
```

---

## API Request Headers

### With JWT Token

```
GET /api/employees/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4NjQ5MjAwLCJpYXQiOjE3MTg2NDU2MDAsImp0aSI6ImUwYTk5OWU3MDcwYjQwYTI5MzljZWE4ZWI1MzNkNzk3IiwidXNlcl9pZCI6InV1aWQtaGVyZSJ9.signature
Content-Type: application/json
Accept: application/json
```

---

## JWT Token Decoded Example

### Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload (Access Token)
```json
{
  "token_type": "access",
  "exp": 1718649200,
  "iat": 1718645600,
  "jti": "e0a999e7070b40a2939cea8eb533d797",
  "user_id": "uuid-here"
}
```

### Payload (Refresh Token)
```json
{
  "token_type": "refresh",
  "exp": 1719250400,
  "iat": 1718645600,
  "jti": "f32a000c48e44985b4090231557f7c517",
  "user_id": "uuid-here"
}
```

---

Last Updated: 2024
Status: Complete Reference
