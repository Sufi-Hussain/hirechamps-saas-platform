# HireChamps Implementation Guide

## Project Overview

HireChamps is a comprehensive multi-tenant HR Management SaaS platform built with:
- **Frontend**: Next.js 16 (React 19) + Tailwind CSS + TypeScript
- **Backend**: Django 4.2 + DRF + PostgreSQL
- **Architecture**: Multi-tenancy with database row-level isolation
- **Payroll Engine**: Python-based, versioned, composable rules system

## Completed Modules

### 1. Foundation & Architecture (Complete)
- Multi-tenant Django backend with tenant middleware
- PostgreSQL database schema with UUID primary keys
- Django REST Framework API with authentication
- Next.js frontend with Zustand state management
- API client with axios and SWR for data fetching
- Landing page with responsive design

**Key Files**:
- Backend: `/server/core/models.py`, `/server/config/settings.py`
- Frontend: `/lib/api.ts`, `/lib/store.ts`, `/app/page.tsx`

### 2. Employee Management Module (Complete)
- User authentication (login/register)
- Dashboard with statistics and quick actions
- Employee directory with search and filtering
- Add employee functionality
- Role-based access control (admin, hr, manager, employee, recruiter)

**Key Files**:
- `/app/auth/login/page.tsx` - Login page
- `/app/auth/register/page.tsx` - Registration page
- `/app/dashboard/layout.tsx` - Dashboard layout with sidebar navigation
- `/app/dashboard/page.tsx` - Main dashboard
- `/app/dashboard/employees/page.tsx` - Employee management

### 3. Leave & Attendance Module (Complete)
- Leave request management (create, approve, reject)
- Leave balance tracking by employee and type
- Attendance records tracking
- Multi-tab interface for different views
- Integration with leave types and leave balance models

**Key Files**:
- `/app/dashboard/leave/page.tsx` - Leave and attendance management
- Backend API endpoints: `/leave-requests/`, `/leave-balances/`, `/attendance/`

## To-Do: Remaining Modules

### 4. Payroll Engine & Salary Slips (In Progress)

**Backend Implementation**:

1. **Python Payroll Rules Engine** (`/server/core/payroll_rules.py`):
   - `IncomeTaxRule`: Indian income tax calculation based on salary slabs
   - `ProvidentFundRule`: PF contributions (12% employee + 12% employer)
   - `ESIRule`: ESI contributions where applicable
   - `ProfessionalTaxRule`: State-specific professional tax
   - `BonusRule`: Annual bonus calculation
   - `GratuityRule`: Gratuity on separation
   - `PayrollCalculator`: Composite calculator applying multiple rules

2. **Backend API Endpoints**:
   ```python
   POST /api/salary-slips/                 # Create salary slip
   GET /api/salary-slips/                  # List salary slips
   GET /api/salary-slips/{id}/             # Get salary slip
   GET /api/salary-slips/my_slips/         # Get current user's slips
   POST /api/payroll-rules/                # Create payroll rule
   GET /api/payroll-rules/                 # List rules
   ```

**Frontend Implementation**:
1. Create `/app/dashboard/payroll/page.tsx` with:
   - Salary slip list and viewer
   - Monthly slip generation interface
   - Tax calculation preview
   - Payroll rule configuration
   - Salary structure management

2. Components needed:
   - SalarySlipViewer (PDF-like display)
   - PayrollRuleEditor
   - SalaryStructureForm

### 5. Recruitment & ATS Module

**Backend**:
- `JobPosting` model: Job vacancy management
- `Candidate` model: Applicant tracking
- Endpoints for posting jobs, tracking candidates through pipeline

**Frontend**:
1. Job posting creation and management
2. Candidate pipeline view (kanban board with statuses)
3. Candidate detail page with resume, notes, feedback
4. Interview scheduling
5. Offer generation and acceptance

**Key Pages**:
- `/app/dashboard/recruitment/page.tsx` - Main recruitment dashboard
- `/app/dashboard/recruitment/jobs/page.tsx` - Job listings
- `/app/dashboard/recruitment/candidates/page.tsx` - Candidate pipeline

### 6. Learning & Training Module

**Backend**:
- `TrainingProgram` model: Training courses
- `TrainingEnrollment` model: Employee participation
- Endpoints for program management and enrollment

**Frontend**:
1. Training program catalog
2. Enrollment management
3. Progress tracking
4. Certificate generation
5. Training effectiveness reports

**Key Pages**:
- `/app/dashboard/learning/page.tsx` - Training dashboard
- `/app/dashboard/learning/programs/page.tsx` - Program listing
- `/app/dashboard/learning/enrollments/page.tsx` - My enrollments

### 7. Analytics, Reports & Dashboard

**Backend**:
- Aggregate endpoints for statistics
- Report generation endpoints
- Export functionality (CSV, PDF)

**Frontend**:
1. Executive dashboard with KPIs
2. Employee analytics (tenure, turnover, etc.)
3. Payroll analytics (cost breakdown, trends)
4. Recruitment analytics (time to hire, pipeline)
5. Learning analytics (participation, ROI)
6. Custom report builder

**Key Pages**:
- `/app/dashboard/analytics/page.tsx` - Main analytics
- `/app/dashboard/analytics/[report].tsx` - Specific reports

## Database Schema Overview

### Core Models
- **Organization**: Multi-tenant container
- **User**: System users with roles (admin, hr, manager, employee, recruiter)
- **Department**: Organizational departments
- **Designation**: Job titles with salary structure

### HR Models
- **Employee**: Employee master data
- **LeaveType**, **LeaveBalance**, **LeaveRequest**: Leave management
- **Attendance**: Daily attendance tracking
- **SalaryStructure**, **SalarySlip**: Salary management

### Payroll Models
- **PayrollRule**: Versioned payroll rules (income tax, PF, ESI, etc.)

### Recruitment Models
- **JobPosting**: Job vacancies
- **Candidate**: Job applicants

### Learning Models
- **TrainingProgram**: Training courses
- **TrainingEnrollment**: Employee participation

## API Architecture

### Base URL
```
Development: http://localhost:8000/api
Production: https://your-domain.com/api
```

### Authentication
- Session-based authentication for development
- JWT tokens recommended for production
- All requests require `Authorization` header (when authenticated)

### Multi-Tenancy Headers
```
X-Tenant-ID: <organization_id>
X-Organization-Slug: <organization_slug>
```

### Pagination
```
GET /api/employees/?page=1&limit=50
Response:
{
  "count": 100,
  "next": "...",
  "previous": null,
  "results": [...]
}
```

## Environment Setup

### Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
pnpm install
pnpm dev
```

### Database Setup
PostgreSQL with multi-tenancy:
```sql
CREATE DATABASE hirechamps_dev;
```

## Key Implementation Notes

### Multi-Tenancy
- Database row-level filtering via `TenantMiddleware`
- Organization context extracted from `X-Tenant-ID` or user's organization
- All queries auto-filtered by current organization in `TenantAwareViewSet`

### Authentication Flow
1. User registers → Creates `User` + `Organization`
2. User logs in → Gets session/JWT token
3. Token sent in all API requests
4. Token expired → Redirect to login page

### Payroll Rules Versioning
- Rules are versioned (`version` field in `PayrollRule`)
- Each rule is effective for a date range (`effective_from`, `effective_to`)
- Salary slips calculate based on applicable rules for the month
- Examples:
  ```python
  # Create new tax rule version
  PayrollRule.objects.create(
    organization=org,
    name="Income Tax FY 2024-25",
    rule_type="income_tax",
    version=2,
    effective_from=date(2024, 4, 1),
    configuration={...}
  )
  ```

### Component Structure
```
app/
├── auth/
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   ├── layout.tsx (main dashboard layout)
│   ├── page.tsx (dashboard home)
│   ├── employees/page.tsx
│   ├── leave/page.tsx
│   ├── payroll/page.tsx
│   ├── recruitment/page.tsx
│   ├── learning/page.tsx
│   ├── analytics/page.tsx
│   └── settings/page.tsx
├── page.tsx (landing page)
└── layout.tsx (root layout)

lib/
├── api.ts (API client)
├── store.ts (Zustand stores)
└── utils.ts (utilities)

components/
└── ui/
    ├── button.tsx
    ├── card.tsx
    └── ... (shadcn components)
```

## Deployment

### Frontend (Vercel)
```bash
pnpm build
# Deploy to Vercel or run: pnpm start
```

### Backend (Docker)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY server/ .
CMD ["gunicorn", "config.wsgi", "--bind", "0.0.0.0:8000"]
```

## Security Considerations

1. **CORS**: Configure `CORS_ALLOWED_ORIGINS` in settings
2. **CSRF**: Enabled by default in Django
3. **Authentication**: Use HTTPS in production
4. **Data Isolation**: Row-level filtering via tenant middleware
5. **Password Hashing**: Django's `make_password` utility
6. **Rate Limiting**: Recommended for API endpoints
7. **Input Validation**: All serializers validate input

## Testing Checklist

- [ ] User authentication and role-based access
- [ ] Multi-tenant data isolation
- [ ] Leave request workflow (request → approve → apply to balance)
- [ ] Payroll rule calculations with various configurations
- [ ] Employee CRUD operations
- [ ] Attendance tracking
- [ ] Report generation
- [ ] API pagination and filtering
- [ ] Error handling and validation

## Next Steps

1. Implement Payroll Engine page and salary slip generation
2. Build Recruitment ATS with candidate pipeline
3. Create Learning management interface
4. Build comprehensive Analytics dashboards
5. Add real-time notifications (WebSocket)
6. Implement async task queue for payroll processing (Celery)
7. Add SMS/Email notifications
8. Create mobile-responsive views
9. Add comprehensive logging and monitoring
10. Performance optimization and caching

## Support & Troubleshooting

### Common Issues
1. **CORS errors**: Check `CORS_ALLOWED_ORIGINS` in Django settings
2. **401 Unauthorized**: Token expired, clear localStorage and login again
3. **404 API errors**: Ensure backend is running on correct port
4. **Multi-tenant issues**: Check `X-Tenant-ID` header is being sent

### Debug Mode
Add to `/lib/api.ts`:
```typescript
api.interceptors.response.use(
  res => {
    console.log('[API]', res.config.url, res.data);
    return res;
  }
);
```

## Project Timeline

- **Week 1-2**: Foundation & Architecture ✓
- **Week 3**: Employee Management ✓
- **Week 4**: Leave & Attendance ✓
- **Week 5-6**: Payroll Engine & Salary Slips
- **Week 7**: Recruitment & ATS
- **Week 8**: Learning & Training
- **Week 9-10**: Analytics & Reports

## Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js 16](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [SWR](https://swr.vercel.app/)

---

**Last Updated**: June 2024
**Status**: Foundation complete, modules in progress
