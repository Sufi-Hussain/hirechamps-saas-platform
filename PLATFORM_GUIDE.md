# HireChamps Employee Self-Service Platform

## Overview

A comprehensive, enterprise-grade Employee Self-Service platform built with Next.js 16, React 19, TypeScript, and modern web technologies. The platform provides employees with a centralized hub for managing HR processes, leave, attendance, payroll, benefits, performance, and professional development.

## Platform Modules

### 1. **Dashboard** (`/dashboard`)
- Quick statistics and KPIs
- Today's schedule and attendance summary
- Leave balance overview
- Recent announcements feed
- Quick action shortcuts
- Performance at a glance

**Components:**
- `QuickStatistics`: Key metrics display
- `TodaySchedule`: Daily schedule view
- `AttendanceSummary`: Attendance overview
- `AnnouncementsFeed`: Company news
- `RecentActivity`: Activity timeline

### 2. **Employee Profile** (`/dashboard/profile`)
- Personal information management
- Professional details
- Profile completion tracking
- Document management
- Contact information
- Emergency contacts

**Sub-routes:**
- `/profile` - Profile overview
- `/profile/personal` - Personal information
- `/profile/professional` - Professional details

**Components:**
- `ProfileCard`: Profile header with photo
- `ProfileCompletionBar`: Progress indicator

### 3. **Attendance & Time Management** (`/dashboard/attendance`)
- Check-in/Check-out functionality
- Calendar view of attendance
- Analytics and reports
- Attendance history
- Late/Early departure tracking

**Sub-routes:**
- `/attendance` - Attendance dashboard
- `/attendance/calendar` - Calendar view
- `/attendance/analytics` - Analytics dashboard

**Components:**
- `CheckInButton`: Quick check-in action
- `AttendanceTable`: Attendance records

### 4. **Leave Management** (`/dashboard/leave`)
- Apply for leave
- Leave balance tracking
- Leave history
- Leave request status
- Different leave types support

**Features:**
- Real-time API integration
- Leave type selection
- Date range selection
- Approval workflow
- Balance management

**Components:**
- `LeaveBalanceCards`: Balance display
- `LeaveTable`: Leave requests list

### 5. **Payroll & Salary** (`/dashboard/payroll`)
- Salary slip viewing
- Year-to-date calculations
- Tax information
- Deductions breakdown
- Salary history
- Download/Print functionality

**Components:**
- `SalarySlipViewer`: Detailed salary slip display

### 6. **Benefits & Wellness** (`/dashboard/benefits`)
- Health insurance information
- Life insurance details
- Retirement plans
- Wellness programs
- Enrollment status
- Benefits documentation

### 7. **Performance Management** (`/dashboard/performance`)
- Goal tracking
- Performance reviews
- KPI monitoring
- Achievement tracking
- Career development
- Performance scores

### 8. **Learning & Development** (`/dashboard/learning`)
- Course enrollment
- Progress tracking
- Certification information
- Learning paths
- Course completion
- Skill development

### 9. **Requests & Approvals** (`/dashboard/requests`)
- Work from home requests
- Equipment requests
- Policy exceptions
- Request tracking
- Approval status
- Request history

### 10. **Announcements** (`/dashboard/announcements`)
- Company announcements
- Priority-based filtering
- Search functionality
- Category organization
- Pinned important announcements
- Archive management

## Component Architecture

### Core UI Components
Located in `/components/ui/`:
- `Button`: Primary action component
- `Card`: Content container
- `Badge`: Status indicators
- `Table`: Data display
- `Modal`: Dialog boxes
- `Tabs`: Tab navigation
- `Avatar`: User avatars
- `Input/Select`: Form inputs

### Common Components
Located in `/components/common/`:
- `MetricCard`: KPI display
- `DataTable`: Reusable table
- `EmptyState`: Empty state UI
- `LoadingState`: Loading skeleton
- `Timeline`: Timeline display
- `ProgressBar`: Progress indicator

### Layout Components
- `RootLayout`: Main app layout
- `DashboardLayout`: Dashboard layout with navigation

### Module-Specific Components
- `/components/attendance/`: Attendance components
- `/components/leave/`: Leave management components
- `/components/payroll/`: Payroll components
- `/components/profile/`: Profile components

## Technical Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **React**: 19.2 with Canary features
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui
- **Icons**: Lucide React
- **Data Fetching**: SWR (for client-side caching)

### Backend Integration
- **API Client**: Custom Axios-based API client
- **Authentication**: Token-based auth
- **Database**: Django ORM (via backend)
- **Real-time**: API polling via SWR

### Development Tools
- **Package Manager**: npm
- **Bundler**: Turbopack (Next.js 16)
- **Linting**: ESLint
- **Type Checking**: TypeScript

## Key Features

### 1. **Responsive Design**
- Mobile-first approach
- Tablet optimization
- Desktop-optimized layouts
- Dark mode support

### 2. **Performance**
- Server-side rendering
- Automatic code splitting
- Image optimization
- Turbopack bundling

### 3. **User Experience**
- Intuitive navigation
- Quick actions
- Search functionality
- Loading states
- Error handling

### 4. **Security**
- Authentication middleware
- Protected routes
- Secure API communication
- Input validation

### 5. **Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast
- Screen reader support

## File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard layout
│   │   ├── page.tsx            # Dashboard home
│   │   ├── attendance/
│   │   ├── benefits/
│   │   ├── learning/
│   │   ├── leave/
│   │   ├── payroll/
│   │   ├── performance/
│   │   ├── profile/
│   │   ├── requests/
│   │   ├── announcements/
│   │   └── [other modules]
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── common/                 # Shared components
│   ├── layout/                 # Layout components
│   ├── attendance/
│   ├── leave/
│   ├── payroll/
│   └── profile/
├── lib/
│   ├── api.ts                  # API client
│   ├── store.ts                # State management
│   ├── utils.ts                # Utilities
│   └── constants.ts            # Constants
├── styles/
│   ├── globals.css             # Global styles
│   └── [other styles]
├── public/                     # Static assets
└── [config files]
```

## Getting Started

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env.local file with:
NEXT_PUBLIC_API_URL=your_api_url
```

### Running Development Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

### Building for Production
```bash
npm run build
npm start
```

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional
NODE_ENV=development
```

## API Integration

The platform integrates with a Django REST API backend with the following endpoints:

### Leave Management
- `GET /leave-requests/` - Get leave requests
- `POST /leave-requests/` - Create leave request
- `GET /leave-types/` - Get leave types
- `GET /leave-balances/my_balance/` - Get leave balance

### Attendance
- `POST /attendance/check-in/` - Check in
- `POST /attendance/check-out/` - Check out
- `GET /attendance/` - Get attendance records

### Payroll
- `GET /salary-slips/` - Get salary slips
- `GET /salary-slips/{id}/` - Get specific slip

### Profile
- `GET /employees/me/` - Get current employee
- `PUT /employees/me/` - Update employee info
- `GET /employees/{id}/` - Get employee details

## Performance Optimization

1. **Code Splitting**: Automatic with Next.js
2. **Image Optimization**: Next.js Image component
3. **Caching**: SWR for client-side caching
4. **Lazy Loading**: React Suspense for components
5. **CSS-in-JS**: Tailwind for optimized CSS

## Security Considerations

1. **Authentication**: Token stored securely
2. **HTTPS**: Required in production
3. **CORS**: Configured on backend
4. **Input Validation**: Client and server-side
5. **XSS Protection**: React built-in
6. **CSRF Protection**: Handled by backend

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Docker
```bash
docker build -t hirechamps .
docker run -p 3000:3000 hirechamps
```

### Traditional Server
```bash
npm run build
npm start
```

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components
- Implement proper error handling
- Add loading states
- Use semantic HTML

### Component Development
1. Create in appropriate directory
2. Export from barrel files
3. Document props with JSDoc
4. Test responsiveness
5. Add accessibility features

### Testing
```bash
npm run test          # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Troubleshooting

### Common Issues

**Issue**: Components not rendering
- **Solution**: Check imports, verify component exists

**Issue**: API calls failing
- **Solution**: Check NEXT_PUBLIC_API_URL, verify backend running

**Issue**: Styling not applying
- **Solution**: Clear cache, rebuild Tailwind

**Issue**: Dark mode not working
- **Solution**: Check theme configuration, verify CSS variables

## Future Enhancements

1. **Real-time Notifications**: WebSocket integration
2. **Advanced Analytics**: Charts and graphs
3. **Mobile App**: React Native version
4. **Offline Support**: Service workers
5. **Advanced Reporting**: PDF export
6. **Integration**: Third-party tools
7. **Automation**: Workflow automation
8. **AI Features**: Chatbot support

## Support & Contribution

For issues or contributions, refer to the main repository documentation.

## License

Enterprise License - All rights reserved

## Version

1.0.0 - Initial Release
