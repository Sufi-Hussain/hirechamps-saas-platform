# Invite Employee Feature - Production Guide

## Overview

The Invite Employee feature provides a production-ready interface for HR managers to invite new employees to the organization. Employees receive secure email invitations with a token-based password setup link.

## Architecture

### Components

#### 1. **InviteEmployeeForm** (`components/InviteEmployeeForm.tsx`)
Main form component with:
- React Hook Form for form state management
- Zod schema validation
- Real-time field validation
- Loading and error states
- API integration with SWR data fetching

**Props:** None (standalone component)

**Features:**
- Automatic designation and department fetching
- Form reset after successful submission
- Inline error messages with icons
- Success toast notification
- Responsive grid layout

#### 2. **InviteEmployeeModal** (`components/InviteEmployeeModal.tsx`)
Modal wrapper for inline invitations on employees list page.

**Props:**
```typescript
interface InviteEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
}
```

**Usage:**
```tsx
const [isOpen, setIsOpen] = useState(false)
return (
  <>
    <Button onClick={() => setIsOpen(true)}>Invite Employee</Button>
    <InviteEmployeeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
  </>
)
```

#### 3. **ToastProvider** (`components/ToastProvider.tsx`)
Notification system with position-based toast rendering.

**Features:**
- Multiple toast types: success, error, info, warning
- Position support: top-left, top-right, bottom-left, bottom-right
- Auto-dismiss with configurable duration
- Smooth animations

### Pages

#### **Invite Employee Page** (`app/dashboard/hr/invite-employee/page.tsx`)
Dedicated page for inviting employees with:
- Back navigation to employees list
- Informational cards explaining the flow
- Full-width form layout
- Gradient background

**Access:** `/dashboard/hr/invite-employee`

### Hooks

#### **useInviteEmployee** (`hooks/useInviteEmployee.ts`)
Custom hook encapsulating invite logic.

**Return Value:**
```typescript
{
  isLoading: boolean      // Request in progress
  error: string | null    // Error message if any
  success: boolean        // Last request successful
  invite: (data) => Promise<Response | null>  // Invite function
  reset: () => void       // Reset state
}
```

**Usage:**
```tsx
const { isLoading, error, invite } = useInviteEmployee()

const handleSubmit = async (data) => {
  const result = await invite(data)
  if (result) {
    // Handle success
  }
}
```

### Schemas & Types

#### **Zod Schema** (`lib/schemas/invite.ts`)
Comprehensive form validation with:
- First/Last name: 2-50 characters
- Email: Valid format required
- Phone: Optional, regex validation for international formats
- Designation: Required selection
- Department: Optional selection
- Date of Joining: Future date validation (today or later)

#### **TypeScript Interfaces** (`types/invite.ts`)
```typescript
interface InviteEmployeeRequest {
  email: string
  first_name: string
  last_name: string
  phone?: string
  designation: string
  department?: string
  date_of_joining: string
}

interface InviteEmployeeResponse {
  message: string
  user_id: string
  email: string
  invite_token: string  // Not exposed to UI
}
```

### Toast System

#### **API** (`lib/toast.ts`)

```typescript
// Notifications
toast.success(message, options)
toast.error(message, options)
toast.info(message, options)
toast.warning(message, options)

// Dismiss
toast.dismiss(id)
toast.dismissAll()

// Hook
const toasts = useToasts()
```

**Options:**
```typescript
{
  duration?: number        // Default: 4000ms
  position?: string       // Default: 'bottom-right'
}
```

## Integration Guide

### 1. Add ToastProvider to Root Layout

Update `app/layout.tsx`:
```tsx
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

### 2. Use InviteEmployeeForm Standalone

```tsx
import { InviteEmployeeForm } from '@/components/InviteEmployeeForm'

export default function MyPage() {
  return <InviteEmployeeForm />
}
```

### 3. Use InviteEmployeeModal in Employees List

```tsx
'use client'

import { useState } from 'react'
import { InviteEmployeeModal } from '@/components/InviteEmployeeModal'
import { Button } from '@/components/ui/button'

export default function EmployeesPage() {
  const [showInviteModal, setShowInviteModal] = useState(false)

  return (
    <>
      <Button onClick={() => setShowInviteModal(true)}>
        Invite Employee
      </Button>
      <InviteEmployeeModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </>
  )
}
```

### 4. Custom Implementation with Hook

```tsx
import { useInviteEmployee } from '@/hooks/useInviteEmployee'

export function CustomInviteForm() {
  const { isLoading, error, invite } = useInviteEmployee()

  const handleSubmit = async (data) => {
    const result = await invite(data)
    if (result) {
      console.log('Invited:', result.email)
    }
  }

  return (
    // Your custom UI
  )
}
```

## API Integration

### Endpoint

**POST** `/api/accounts/invite-employee/`

### Request

```json
{
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1-555-123-4567",
  "designation": "des-123",
  "department": "dept-456",
  "date_of_joining": "2024-01-15"
}
```

### Response

```json
{
  "message": "Employee invited successfully",
  "user_id": "usr-789",
  "email": "john.doe@example.com",
  "invite_token": "secure_token_here"
}
```

### Error Response

```json
{
  "detail": "Email already exists in organization",
  "error": "Duplicate email"
}
```

## Validation Rules

### Field Validation

| Field | Rule | Message |
|-------|------|---------|
| first_name | 2-50 chars | "First name must be 2-50 characters" |
| last_name | 2-50 chars | "Last name must be 2-50 characters" |
| email | Valid format | "Please enter a valid email address" |
| phone | Optional, regex | "Please enter a valid phone number" |
| designation | Required | "Please select a designation" |
| department | Optional | - |
| date_of_joining | Future date | "Date must be today or in the future" |

### Phone Format Support

Supports international formats:
- `+1-555-123-4567`
- `(555) 123-4567`
- `555.123.4567`
- `555-123-4567`
- `+44 20 7946 0958`

## Styling & Customization

### Color Scheme

- **Primary:** Blue (#3B82F6)
- **Success:** Green (#16A34A)
- **Error:** Red (#DC2626)
- **Warning:** Yellow (#EAB308)
- **Background:** Gray (#F9FAFB)

### Theme Integration

All components use Tailwind CSS with semantic color classes:
- `bg-blue-600` (primary actions)
- `text-red-600` (errors)
- `text-green-600` (success)
- `border-gray-200` (borders)

### Responsive Design

- **Mobile:** Single column layout
- **Tablet+:** 2-column grid for name/phone, designation/department

## Security Considerations

### Token Handling
- Invite tokens are **never** exposed in the UI
- Tokens are only visible in API response metadata
- Only stored server-side with 7-day expiration

### Email Validation
- Email format validation on client
- Server performs duplicate check
- Organization isolation ensures no cross-org leaks

### Date Validation
- Client: Prevents selecting past dates
- Server: Validates date_of_joining >= today

### CSRF Protection
- Uses existing API auth interceptors
- Authorization header automatically added
- Secure token-based invite flow

## Error Handling

### Common Errors

**Email already exists:**
```
Detail: "Email already exists in this organization"
```
**Solution:** Use a different email address

**Invalid designation:**
```
Detail: "Invalid designation"
```
**Solution:** Select from the provided dropdown

**Server error:**
```
Error: "Failed to send invitation. Please try again."
```
**Solution:** Retry request or contact support

### Error Recovery

1. Toast displays error message
2. Form remains populated
3. User can correct and resubmit
4. No data loss on error

## Performance Optimization

### Data Fetching
- SWR caches designation/department lists
- Subsequent form opens use cached data
- Automatic revalidation every 60 seconds

### Form Optimization
- React Hook Form minimizes re-renders
- Validation only on blur (not on change)
- Efficient debounced searches

### Bundle Impact
- InviteEmployeeForm: ~25KB (gzipped)
- Toast system: ~3KB (gzipped)
- Total additional: ~28KB

## Accessibility

### ARIA Labels
- Form fields have proper `<label>` associations
- Error messages linked to fields
- Required field indicators

### Keyboard Navigation
- Tab through all form fields
- Enter to submit form
- Escape to close modal

### Screen Reader Support
- Semantic HTML structure
- Error messages announced
- Loading state communicated

## Testing Guide

### Manual Testing

1. **Form Submission:**
   - Fill all required fields
   - Click "Send Invitation"
   - Verify success toast appears
   - Check form is reset

2. **Validation:**
   - Leave fields empty → errors appear
   - Enter invalid email → error shown
   - Select past date → error shown
   - Enter invalid phone → error shown

3. **API Error:**
   - Use duplicate email → error toast
   - Check network tab for correct payload
   - Verify Authorization header present

4. **Modal Flow:**
   - Open modal
   - Fill form
   - Submit
   - Verify form resets
   - Close and reopen → clean state

### Test Cases

```typescript
// Form validation tests
test('first_name required', async () => {
  const { getByRole } = render(<InviteEmployeeForm />)
  const submit = getByRole('button', { name: /send/i })
  fireEvent.click(submit)
  expect(getByText(/first name is required/i)).toBeInTheDocument()
})

// API integration tests
test('invite success', async () => {
  const { getByRole, getByText } = render(<InviteEmployeeForm />)
  await fillForm(...)
  fireEvent.click(getByRole('button', { name: /send/i }))
  await waitFor(() => {
    expect(getByText(/invitation sent successfully/i)).toBeInTheDocument()
  })
})

// Error handling tests
test('API error display', async () => {
  mockApi.post.mockRejectedValueOnce(new Error('Email exists'))
  // ... test error display
})
```

## Troubleshooting

### Form Not Submitting
- Check API endpoint is correct
- Verify Authorization header present
- Check browser console for errors
- Ensure all required fields filled

### Dropdowns Not Loading
- Check `/designations/` and `/departments/` endpoints exist
- Verify API response format matches expected schema
- Check network tab for failed requests

### Toasts Not Appearing
- Ensure `<ToastProvider />` in root layout
- Check `z-index: 50` not covered by other elements
- Verify toast container CSS applied

### Styling Issues
- Ensure Tailwind CSS configured correctly
- Check for CSS conflicts with existing styles
- Verify color classes match theme

## Future Enhancements

1. **Bulk Invite:** CSV upload for multiple invites
2. **Templates:** Save and reuse invite templates
3. **Scheduling:** Schedule invites for future dates
4. **Reminders:** Auto-resend if not accepted
5. **Analytics:** Track invite acceptance rates
6. **Customization:** Custom email templates

## Support

For issues or questions:
1. Check this documentation
2. Review test cases for examples
3. Check browser console for errors
4. Verify API endpoints responding correctly
5. Contact development team with error details
