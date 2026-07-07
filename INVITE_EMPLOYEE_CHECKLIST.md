# Invite Employee Feature - Integration Checklist

## Quick Setup (5 minutes)

- [ ] Add `<ToastProvider />` to `app/layout.tsx`
- [ ] Test form at `/dashboard/hr/invite-employee`
- [ ] Verify API endpoint responds

## Files Created

### Components (3)
- [ ] `components/InviteEmployeeForm.tsx` - Main form
- [ ] `components/InviteEmployeeModal.tsx` - Modal wrapper
- [ ] `components/ToastProvider.tsx` - Toast notifications

### Pages (1)
- [ ] `app/dashboard/hr/invite-employee/page.tsx` - Dedicated page

### Hooks (1)
- [ ] `hooks/useInviteEmployee.ts` - Reusable logic

### Schemas & Types (2)
- [ ] `lib/schemas/invite.ts` - Zod validation schema
- [ ] `types/invite.ts` - TypeScript interfaces

### Utilities (1)
- [ ] `lib/toast.ts` - Toast notification system

### Documentation (2)
- [ ] `INVITE_EMPLOYEE_GUIDE.md` - Full guide
- [ ] `INVITE_EMPLOYEE_CHECKLIST.md` - This file

## Feature Verification

### Form Fields
- [ ] First Name (required, 2-50 chars)
- [ ] Last Name (required, 2-50 chars)
- [ ] Email (required, valid format)
- [ ] Phone (optional, regex validation)
- [ ] Designation (required dropdown, API-driven)
- [ ] Department (optional dropdown, API-driven)
- [ ] Date of Joining (required date picker, future date only)

### Form Functionality
- [ ] Form submits successfully with valid data
- [ ] Form shows validation errors for invalid data
- [ ] Form resets after successful submission
- [ ] Loading spinner shows during submission
- [ ] Success message displays after submission
- [ ] Error messages display clearly
- [ ] Dropdowns load options from API

### API Integration
- [ ] POST `/api/accounts/invite-employee/` works
- [ ] GET `/designations/` endpoint responds
- [ ] GET `/departments/` endpoint responds
- [ ] Bearer token sent in Authorization header
- [ ] Request payload matches expected format
- [ ] Response includes invite_token (not shown to user)
- [ ] Error responses handled gracefully

### User Experience
- [ ] Toast notifications appear and auto-dismiss
- [ ] Form is responsive on mobile/tablet/desktop
- [ ] Error messages have icons
- [ ] Required field indicators visible
- [ ] Tab navigation works through form
- [ ] Modal can be opened and closed
- [ ] Back button navigates correctly

### Accessibility
- [ ] Form fields have associated labels
- [ ] Error messages linked to fields
- [ ] Keyboard navigation works
- [ ] Screen reader announces errors
- [ ] Color contrast sufficient
- [ ] Focus indicators visible

## Integration Points

### Root Layout
```tsx
// app/layout.tsx
import { ToastProvider } from '@/components/ToastProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
```

### Employees List Integration
```tsx
// In your employees list page
import { InviteEmployeeModal } from '@/components/InviteEmployeeModal'

const [showInviteModal, setShowInviteModal] = useState(false)

// Add button
<Button onClick={() => setShowInviteModal(true)}>
  Invite Employee
</Button>

// Add modal
<InviteEmployeeModal
  isOpen={showInviteModal}
  onClose={() => setShowInviteModal(false)}
/>
```

## API Requirements

### Designations Endpoint
**URL:** `GET /api/designations/`

**Response:**
```json
[
  {
    "id": "des-123",
    "name": "Software Engineer",
    "description": "..."
  }
]
```

### Departments Endpoint
**URL:** `GET /api/departments/`

**Response:**
```json
[
  {
    "id": "dept-456",
    "name": "Engineering",
    "code": "ENG"
  }
]
```

### Invite Employee Endpoint
**URL:** `POST /api/accounts/invite-employee/`

**Request:**
```json
{
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1-555-123-4567",
  "designation": "des-123",
  "department": "dept-456",
  "date_of_joining": "2024-01-15"
}
```

**Response (Success - 201):**
```json
{
  "message": "Employee invited successfully",
  "user_id": "usr-789",
  "email": "john@example.com",
  "invite_token": "..."
}
```

**Response (Error - 400):**
```json
{
  "detail": "Email already exists in this organization"
}
```

## Testing Scenarios

### Happy Path
- [ ] Fill all required fields with valid data
- [ ] Click "Send Invitation"
- [ ] Success toast appears
- [ ] Form resets to blank state
- [ ] Employee receives invitation email

### Validation Errors
- [ ] Empty first_name → error message
- [ ] Empty last_name → error message
- [ ] Invalid email → error message
- [ ] Empty designation → error message
- [ ] Past date → error message

### API Errors
- [ ] Duplicate email → error toast
- [ ] Invalid designation → error toast
- [ ] Network error → error toast
- [ ] Server error (500) → error toast

### User Interactions
- [ ] Close modal without submitting
- [ ] Fill form, then close modal
- [ ] Open form, fill, submit, then open again → clean state
- [ ] Tab through all fields
- [ ] Use keyboard to submit (Tab + Enter)

## Performance Verification

- [ ] Form loads in < 1s
- [ ] Designations/departments cached by SWR
- [ ] No console errors
- [ ] No network requests blocked by CSP
- [ ] Images/icons load properly
- [ ] CSS transitions smooth

## Security Verification

- [ ] Authorization header present in requests
- [ ] No invite token exposed in UI
- [ ] Email validation prevents injections
- [ ] CSRF tokens (if configured) included
- [ ] Password set via separate secure endpoint
- [ ] Form validation prevents malicious input

## Documentation Verification

- [ ] INVITE_EMPLOYEE_GUIDE.md is complete
- [ ] All components documented
- [ ] API contract documented
- [ ] Integration examples provided
- [ ] Troubleshooting section helpful
- [ ] TypeScript types exported properly

## Optional Enhancements

### Phase 2
- [ ] Bulk invite (CSV upload)
- [ ] Email template customization
- [ ] Invite reminders
- [ ] Acceptance tracking
- [ ] Batch send with delay

### Phase 3
- [ ] Department-based templates
- [ ] Role-based invites
- [ ] Integration with Slack/Teams
- [ ] Mobile app support

## Rollout Plan

1. **Development:** All items above checked ✓
2. **Staging:** Full end-to-end testing
3. **Beta:** Internal HR team testing
4. **Production:** Gradual rollout to customer orgs

## Support Resources

- Full guide: `INVITE_EMPLOYEE_GUIDE.md`
- Component source: `components/InviteEmployeeForm.tsx`
- Zod schema: `lib/schemas/invite.ts`
- Types: `types/invite.ts`
- Hook: `hooks/useInviteEmployee.ts`

## Sign-Off

- [ ] Development complete
- [ ] Code reviewed
- [ ] Tests passed
- [ ] Documentation complete
- [ ] Ready for staging

**Date:** ___________
**Developer:** ___________
**Reviewer:** ___________
