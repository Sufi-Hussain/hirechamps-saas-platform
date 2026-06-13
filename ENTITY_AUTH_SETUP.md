## HireChamps: Entity-Based Authentication System - Setup Guide

### Overview

The system now has separate login/register pages for different entity types:
- **Super Admin** - System administration
- **Company Owner** - Organization creation and management
- **HR Manager** - Employee management (invite-only)
- **Employee** - Personal dashboard (invite-only)

### Quick Start (5 Minutes)

#### Step 1: Backend Setup

```bash
# Navigate to server directory
cd server

# Apply migrations (if not done yet)
python manage.py migrate

# Create demo test data
python manage.py seed_demo_data

# Start Django development server
python manage.py runserver 0.0.0.0:8000
```

#### Step 2: Frontend Setup

```bash
# In another terminal, navigate to project root
cd /vercel/share/v0-project

# Install dependencies (if needed)
pnpm install

# Start Next.js development server
pnpm dev
```

#### Step 3: Access the System

Open your browser and navigate to:
- **Auth Landing Page**: `http://localhost:3000/auth`
- **Super Admin Login**: `http://localhost:3000/auth/super-admin/login`
- **Company Owner Login**: `http://localhost:3000/auth/company-owner/login`
- **HR Manager Login**: `http://localhost:3000/auth/hr-manager/login`
- **Employee Login**: `http://localhost:3000/auth/employee/login`

### Demo Credentials

#### Super Admin
- **Email**: super.admin@hirechamps.com
- **Password**: SuperAdmin@123
- **Dashboard**: `/dashboard/platform-admin`

#### Company Owner
- **Email**: owner@acmecorp.com
- **Password**: CompanyOwner@123
- **Dashboard**: `/dashboard/owner`
- **Can Register**: Yes (via `/auth/company-owner/register`)

#### HR Manager
- **Email**: hr@acmecorp.com
- **Password**: HRManager@123
- **Dashboard**: `/dashboard/hr`
- **Can Register**: No (invited by admin)

#### Employee 1
- **Email**: john.doe@acmecorp.com
- **Password**: Employee@123
- **Dashboard**: `/dashboard`

#### Employee 2
- **Email**: jane.smith@acmecorp.com
- **Password**: Employee@123
- **Dashboard**: `/dashboard`

### Directory Structure

```
app/auth/
├── page.tsx                    # Auth landing page with entity selection
├── super-admin/
│   └── login/page.tsx          # Super admin login page
├── company-owner/
│   ├── login/page.tsx          # Company owner login page
│   └── register/page.tsx        # Company owner registration (3-step wizard)
├── hr-manager/
│   └── login/page.tsx          # HR manager login page
└── employee/
    └── login/page.tsx          # Employee login page

server/core/
├── auth_login_views.py         # Login/register API endpoints
└── management/commands/
    └── seed_demo_data.py       # Demo data seeding command
```

### API Endpoints

#### Login
- **POST** `/api/auth/login/`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "token": "jwt_token_here",
  "refresh": "refresh_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

#### Register Company Owner
- **POST** `/api/auth/register-company/`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "company_name": "Acme Corp",
  "domain": "acmecorp",
  "country": "IN",
  "owner_first_name": "John",
  "owner_last_name": "Doe",
  "owner_email": "owner@acme.com",
  "owner_password": "password123"
}
```

### Frontend Features

#### Auth Landing Page (`/auth`)
- Visual entity selection with cards
- Each entity shows:
  - Role icon and description
  - Login button
  - Register button (if applicable)
- Color-coded for easy identification

#### Entity-Specific Login Pages
Each login page includes:
- Entity-specific branding (icon, color, title)
- Email and password fields
- Demo credentials displayed for testing
- Error messaging with clear feedback
- Back button to return to landing page
- Link to registration (Company Owner only)

#### Company Owner Registration (`/auth/company-owner/register`)
Three-step registration wizard:
1. **Step 1: Company Information**
   - Company name
   - Domain (unique identifier)
   - Country selection

2. **Step 2: Owner Details**
   - First name
   - Last name
   - Email address

3. **Step 3: Password Setup**
   - Password creation
   - Password confirmation
   - Validation for security

Progress indicator shows current step with back/next navigation.

### Troubleshooting

#### Login not working
1. Check that both backend and frontend servers are running
2. Verify demo data was seeded: `python manage.py seed_demo_data`
3. Check browser console for errors (F12)
4. Verify correct email/password from demo credentials above

#### Cannot access dashboards after login
1. Verify token is being stored in localStorage
2. Check Network tab in DevTools for API errors
3. Ensure `/dashboard/[role]` pages exist

#### Django not accepting requests
1. Check CORS is configured: `CORS_ALLOWED_ORIGINS` in settings
2. Verify Django running on port 8000
3. Check for migration errors: `python manage.py migrate`

#### Demo data not seeding
1. Ensure database is initialized: `python manage.py migrate`
2. Run: `python manage.py seed_demo_data --flush` (if needed)
3. Check for user creation errors in command output

### Next Steps

#### To Create Additional Users
```python
# Via Django shell
python manage.py shell

from django.contrib.auth.models import User
User.objects.create_user(
    email='newemail@company.com',
    username='newemail@company.com',
    password='NewPassword@123',
    first_name='First',
    last_name='Last'
)
```

#### To Customize Auth Pages
1. Edit role-specific login pages in `/app/auth/[role]/login/page.tsx`
2. Modify colors, icons, and messaging as needed
3. Colors are pre-set per entity type (red for super-admin, blue for owner, etc.)

#### To Add More Entities
1. Create new folder: `/app/auth/[new-role]/login/`
2. Add page.tsx file with login form
3. Update landing page entity cards
4. Add demo credentials to seed_demo_data.py

### Production Deployment

Before deploying to production:

1. **Security**
   - Change SECRET_KEY in Django settings
   - Set DEBUG = False
   - Configure allowed hosts
   - Use environment variables for sensitive data

2. **Database**
   - Run migrations
   - Don't use SQLite in production
   - Configure proper database backups

3. **Frontend**
   - Update API_URL to production backend
   - Configure environment variables
   - Test all auth flows

4. **Email** (Optional)
   - Configure email service for invitations
   - Set email templates
   - Test email sending

5. **Monitoring**
   - Set up error tracking
   - Configure logging
   - Monitor authentication failures

### Common Tasks

#### Reset Demo Data
```bash
# Delete all users and recreate demo data
python manage.py flush --no-input
python manage.py migrate
python manage.py seed_demo_data
```

#### Create New Demo User
Edit `seed_demo_data.py` and add to `demo_users` list, then run:
```bash
python manage.py seed_demo_data
```

#### Change Demo Passwords
1. Edit demo credentials in login pages: `/app/auth/*/login/page.tsx`
2. Update backend seed_demo_data.py
3. Re-run seed command

### Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review Django logs: check terminal running `python manage.py runserver`
3. Check frontend logs: open browser DevTools (F12)
4. Verify database is properly initialized

### Summary

The entity-based authentication system provides:
- ✓ Separate login pages for each entity type
- ✓ Visual entity selection on landing page
- ✓ Demo credentials for testing
- ✓ Company owner self-registration wizard
- ✓ Invite-only access for HR managers and employees
- ✓ Proper error handling and validation
- ✓ Color-coded UI for easy identification
- ✓ Complete backend API integration

All demo users are ready to test. Start with Super Admin to manage the platform, then test Company Owner registration and other roles.
