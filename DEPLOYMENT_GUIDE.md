# HRMS Deployment & Development Guide

## Quick Start for Developers

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Backend server running (Django)
- PostgreSQL database

### Setup

1. **Clone and Install**
```bash
git clone <repo>
cd hirechamps-saas-platform
pnpm install  # or npm install / yarn install
```

2. **Environment Variables**
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. **Run Development Server**
```bash
pnpm dev
# Opens at http://localhost:3000
```

4. **Backend Setup**
```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## Project Structure

### Frontend (`/app` & `/components`)
```
/app
  /auth - Authentication pages
  /dashboard
    /employee - Employee portal
    /payroll - Payroll management  
    /hr - HR operations
    /admin - Manager dashboard
    /owner - Admin dashboard
    /platform-admin - Super admin
  /access-denied - Error page
  /layout.tsx - Root layout

/components
  /providers - Context & providers
  /wrappers - RBAC wrappers
  /ui - Shadcn UI components
  /dashboard - Dashboard components
  
/hooks
  /useRbac.ts - RBAC utilities

/lib
  /api.ts - Axios client
  /store.ts - Zustand stores
```

### Backend (`/server`)
```
/server/core
  /models.py - Database models
  /views.py - API viewsets
  /serializers.py - Data serialization
  /payroll_models.py - Payroll models
  /payroll_serializers.py - Payroll serialization
  /payroll_views.py - Payroll API
  /permissions.py - RBAC rules
  /urls.py - Route definitions
  /auth_views.py - Auth endpoints
  /middleware.py - Custom middleware
```

---

## Development Workflow

### Adding a New Page

1. **Create Route**
```typescript
// app/dashboard/new-page/page.tsx
'use client'

import { useAuthStore } from '@/lib/store'

export default function NewPage() {
  const { user } = useAuthStore()
  return <div>New Page</div>
}
```

2. **Add Navigation Item** (update `app/dashboard/layout.tsx`)
```typescript
const getAvailableModules = (roles: string[]) => {
  const allModules = [
    // ... existing modules
    { 
      id: 'new-page', 
      label: 'New Page', 
      icon: IconComponent, 
      href: '/dashboard/new-page',
      roles: ['admin', 'hr'] 
    },
  ]
  // ...
}
```

3. **Add API Integration**
```typescript
import { useRbac } from '@/hooks/useRbac'
import useSWR from 'swr'
import api from '@/lib/api'

const fetcher = (url: string) => api.get(url).then(res => res.data)
const { data, isLoading, error } = useSWR('/endpoint/', fetcher)
```

4. **Add RBAC Protection** (optional)
```typescript
import { ProtectedRoute } from '@/components/wrappers/ProtectedRoute'

export default function NewPage() {
  return (
    <ProtectedRoute requiredRoles={['admin', 'hr']}>
      <PageContent />
    </ProtectedRoute>
  )
}
```

### Adding a New API Integration

1. **Update `lib/api.ts`** - Add service helper
```typescript
export const apiService = {
  // ... existing
  getNewEndpoint: () => api.get('/new-endpoint/'),
  createNewItem: (data: any) => api.post('/new-endpoint/', data),
}
```

2. **Use in Component**
```typescript
import { apiService } from '@/lib/api'

const response = await apiService.getNewEndpoint()
```

3. **Or Use Direct API Call**
```typescript
const response = await api.get('/new-endpoint/')
const newItem = await api.post('/new-endpoint/', data)
```

### Testing Authentication

1. **Login Test**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"credential":"test@example.com","password":"password"}'
```

2. **Test Token Persistence**
   - Login at http://localhost:3000/auth/login
   - Refresh page - should stay logged in
   - Check localStorage has `auth-store` key

3. **Test RBAC**
   - Login as different roles
   - Verify dashboard changes
   - Check sidebar shows only accessible modules

---

## Common Tasks

### Update API Endpoint

1. Backend changes endpoint response format
2. Update TypeScript types in component
3. Update error handling
4. Test in browser DevTools

### Fix RBAC Issue

1. Check user roles: `useAuthStore().roles`
2. Verify role in backend response
3. Check permission in `useRbac().hasPermission()`
4. Debug: Add console logs to understand flow

### Add New Dashboard Stat

1. Create SWR hook for data
2. Add stat card in dashboard
3. Style with Tailwind
4. Add loading & error states

### Implement Form

1. Use `useForm` from React Hook Form
2. Add Zod validation schema
3. Connect to API
4. Show success/error messages
5. Handle loading state

Example:
```typescript
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

type FormData = z.infer<typeof schema>

export default function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    await api.post('/endpoint/', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}
    </form>
  )
}
```

---

## Debugging

### Enable Console Logging

Add to any component:
```typescript
useEffect(() => {
  console.log('[v0] Component mounted with props:', { user, roles })
}, [user, roles])
```

### Check API Calls

1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Click request → Preview tab
4. See response data
5. Check Authorization header

### Debug Auth Store

```typescript
// In browser console
const store = window.__zustand_store__
store.getState() // See current state
store.setState({ ... }) // Update state
```

### Check RBAC

```typescript
import { useRbac } from '@/hooks/useRbac'

// In component
const rbac = useRbac()
console.log('Roles:', rbac.getRoles())
console.log('Permissions:', rbac.getPermissions())
console.log('Can access?', rbac.hasPermission('read_employees'))
```

---

## Performance Optimization

### Code Splitting

Already configured. Dynamic imports work automatically:
```typescript
const Component = dynamic(() => import('./Component'))
```

### Image Optimization

```typescript
import Image from 'next/image'

<Image 
  src="/image.png" 
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
/>
```

### Database Queries

- Use SWR for caching
- Implement pagination
- Use filtering on backend
- Avoid N+1 queries in backend

### Monitor Performance

```bash
# Build analysis
pnpm build

# Check bundle size
npm install -g next-bundle-analyzer
```

---

## Security Checklist

### Before Production
- [ ] Change default credentials
- [ ] Enable HTTPS
- [ ] Set secure CORS headers
- [ ] Enable rate limiting
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Set httpOnly cookies
- [ ] Audit dependencies (npm audit)
- [ ] Test XSS protection
- [ ] Verify SQL injection protection
- [ ] Check authentication flows
- [ ] Review file uploads
- [ ] Audit data access
- [ ] Enable logging & monitoring

### Environment Variables
- [ ] Never commit `.env.local`
- [ ] Use `.env.example` for reference
- [ ] Set production values in hosting
- [ ] Use separate DB for prod
- [ ] Use separate API keys for prod

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to vercel.com
   - Import project from GitHub
   - Set environment variables
   - Deploy

3. **Monitor Deployment**
   - Check build logs
   - Verify environment variables
   - Test all auth flows
   - Monitor analytics

### Docker Deployment

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Build & Run**
```bash
docker build -t hrms:latest .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=... hrms:latest
```

### Manual Server Deployment

1. **SSH into Server**
```bash
ssh user@server.com
```

2. **Clone Repository**
```bash
git clone <repo> /var/www/hrms
cd /var/www/hrms
```

3. **Install & Build**
```bash
npm install
npm run build
npm start
```

4. **Setup Nginx Proxy**
```nginx
server {
    listen 80;
    server_name hrms.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Setup SSL (Let's Encrypt)**
```bash
certbot certonly --nginx -d hrms.example.com
```

---

## Monitoring & Maintenance

### Health Checks

1. **API Health**
```bash
curl http://localhost:8000/api/health/
```

2. **Frontend Health**
```bash
curl http://localhost:3000/
```

3. **Database Health**
```bash
# From Django shell
python manage.py shell
# Test connection
```

### Logging

- Enable application logging
- Monitor error logs
- Track performance metrics
- Set up alerts for critical issues

### Backup

- Regular database backups
- Document disaster recovery
- Test restore procedures
- Keep backups encrypted

---

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
pnpm install
pnpm build
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### API Connection Issues
- Check backend is running
- Verify API URL in `.env.local`
- Check CORS headers
- Look for 401/403 errors

### Auth Not Working
- Check tokens in localStorage
- Verify JWT_SECRET matches
- Check token expiration
- Clear cookies/localStorage

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Django Docs](https://docs.djangoproject.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com)

---

## Support & Contact

For issues or questions:
1. Check documentation
2. Search GitHub issues
3. Create detailed bug report
4. Contact development team

---

Last Updated: July 2024
