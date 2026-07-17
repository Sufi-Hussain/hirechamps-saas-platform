# Component Usage Guide

This guide provides examples of how to use the reusable components in the HireChamps Employee Self-Service Platform.

## UI Components (shadcn/ui)

### Button

```tsx
import { Button } from '@/components/ui/button'

// Primary button
<Button>Click me</Button>

// Variant options
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// With icon
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add New
</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### Card

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge'

// Variant options
<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="warning">Warning</Badge>
```

### Table

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Modal

```tsx
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalTrigger, ModalClose } from '@/components/ui/modal'

<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
      <ModalDescription>Modal description</ModalDescription>
    </ModalHeader>
    <div className="p-4">
      <p>Modal content here</p>
    </div>
    <ModalClose asChild>
      <Button>Close</Button>
    </ModalClose>
  </ModalContent>
</Modal>
```

### Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

## Common Components

### MetricCard

Display KPIs with icons and optional trends.

```tsx
import { MetricCard } from '@/components/common/MetricCard'
import { DollarSign, TrendingUp } from 'lucide-react'

// Basic
<MetricCard
  icon={<DollarSign className="h-6 w-6" />}
  label="Total Salary"
  value="₹80,000"
  description="Monthly"
/>

// With trend
<MetricCard
  icon={<TrendingUp className="h-6 w-6" />}
  label="Attendance"
  value="95%"
  description="This month"
  trend={{ direction: 'up', value: 5 }}
/>

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <MetricCard {...props1} />
  <MetricCard {...props2} />
  <MetricCard {...props3} />
  <MetricCard {...props4} />
</div>
```

### ProgressBar

Display progress with optional percentage.

```tsx
import { ProgressBar } from '@/components/common/ProgressBar'

// Basic (0-100 by default)
<ProgressBar value={75} />

// With percentage label
<ProgressBar value={75} max={100} showPercentage />

// Custom range
<ProgressBar value={150} max={200} showPercentage />

// Custom styling
<ProgressBar 
  value={60} 
  className="mt-4"
  barClassName="bg-green-600"
/>
```

### DataTable

Reusable table with sorting and pagination.

```tsx
import { DataTable } from '@/components/common/DataTable'

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge>{row.getValue('status')}</Badge>
    ),
  },
]

const data = [
  { id: 1, name: 'John', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane', email: 'jane@example.com', status: 'Active' },
]

<DataTable columns={columns} data={data} />
```

### EmptyState

Display when no data is available.

```tsx
import { EmptyState } from '@/components/common/EmptyState'
import { FileText } from 'lucide-react'

<EmptyState
  icon={<FileText className="h-12 w-12" />}
  title="No requests found"
  description="Start by creating a new request"
  action={
    <Button>Create Request</Button>
  }
/>
```

### LoadingState

Show skeleton loading screens.

```tsx
import { LoadingState } from '@/components/common/LoadingState'

<LoadingState count={5} />  // Shows 5 skeleton cards
```

## Module Components

### LeaveBalanceCards

Display leave balance by type.

```tsx
import { LeaveBalanceCards } from '@/components/leave/LeaveBalanceCards'

<LeaveBalanceCards
  leaveTypes={[
    {
      id: '1',
      name: 'Casual Leave',
      available: 8,
      used: 2,
      total: 10,
      color: 'bg-blue-600',
    },
    {
      id: '2',
      name: 'Sick Leave',
      available: 10,
      used: 0,
      total: 10,
      color: 'bg-red-600',
    },
  ]}
/>
```

### LeaveTable

Display leave requests history.

```tsx
import { LeaveTable } from '@/components/leave/LeaveTable'

<LeaveTable
  data={[
    {
      id: '1',
      type: 'Casual Leave',
      fromDate: '2024-07-15',
      toDate: '2024-07-17',
      days: 3,
      reason: 'Personal work',
      status: 'Approved',
      appliedDate: '2024-07-10',
    },
  ]}
  isLoading={false}
/>
```

### SalarySlipViewer

Display salary slip with breakdown.

```tsx
import { SalarySlipViewer } from '@/components/payroll/SalarySlipViewer'

<SalarySlipViewer
  month="July"
  year="2024"
  employeeName="John Doe"
  designation="Senior Engineer"
  employeeId="EMP-001"
  earnings={{
    category: 'Earnings',
    items: [
      { label: 'Basic Salary', amount: 50000 },
      { label: 'HRA', amount: 15000 },
      { label: 'DA', amount: 10000 },
    ],
  }}
  deductions={{
    category: 'Deductions',
    items: [
      { label: 'Income Tax', amount: 8000 },
      { label: 'PF', amount: 5000 },
    ],
  }}
  grossSalary={75000}
  totalDeductions={13000}
  netSalary={62000}
/>
```

## Layout Patterns

### Dashboard Grid

```tsx
// 4-column grid on desktop, 2 on tablet, 1 on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <MetricCard {...props} />
  <MetricCard {...props} />
  <MetricCard {...props} />
  <MetricCard {...props} />
</div>
```

### Section Layout

```tsx
<section className="space-y-8">
  <div>
    <h1 className="text-4xl font-bold tracking-tight">Page Title</h1>
    <p className="text-muted-foreground mt-2">Page description</p>
  </div>

  <div className="space-y-4">
    {/* Content */}
  </div>
</section>
```

### Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card>
    <CardHeader>
      <CardTitle>Card 1</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Content */}
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <CardTitle>Card 2</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Content */}
    </CardContent>
  </Card>
</div>
```

## Styling Examples

### Typography

```tsx
// Headings
<h1 className="text-4xl font-bold tracking-tight">Main Title</h1>
<h2 className="text-xl font-semibold">Section Title</h2>
<h3 className="text-lg font-semibold">Card Title</h3>

// Body text
<p className="text-base text-foreground">Regular text</p>
<p className="text-sm text-muted-foreground">Muted text</p>
<span className="text-xs text-muted-foreground">Small text</span>
```

### Spacing

```tsx
// Padding
<div className="p-4">Content</div>  // All sides
<div className="px-4">Content</div> // Horizontal
<div className="py-6">Content</div> // Vertical

// Margin
<div className="mt-4">Content</div>  // Top margin
<div className="mb-6">Content</div>  // Bottom margin

// Gap (for flex/grid)
<div className="flex gap-4">Item 1</div>
<div className="grid gap-6">Item 1</div>
```

### Colors

```tsx
// Text colors
<p className="text-foreground">Primary text</p>
<p className="text-muted-foreground">Muted text</p>
<p className="text-primary">Primary color</p>

// Background colors
<div className="bg-background">Default background</div>
<div className="bg-muted">Muted background</div>
<div className="bg-card">Card background</div>

// Border colors
<div className="border border-border">Border</div>
<div className="border border-primary">Primary border</div>
```

### Responsive

```tsx
// Mobile-first
<div className="text-base md:text-lg lg:text-xl">Text</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">Grid</div>
<div className="p-4 md:p-6 lg:p-8">Padding</div>
```

## API Usage with SWR

```tsx
import useSWR from 'swr'
import api from '@/lib/api'

// Data fetching
const { data, isLoading, error, mutate } = useSWR(
  '/leave-requests/',
  (url) => api.get(url).then((res) => res.data)
)

// Display data
{isLoading && <LoadingState />}
{error && <div>Error loading data</div>}
{data && <LeaveTable data={data} />}

// Revalidate data
<Button onClick={() => mutate()}>Refresh</Button>
```

## Form Examples

### Basic Form in Modal

```tsx
const [formData, setFormData] = useState({ name: '', email: '' })

<Modal>
  <ModalTrigger asChild>
    <Button>Open Form</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Form Title</ModalTitle>
    </ModalHeader>
    <div className="space-y-4 p-4">
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Name"
        className="w-full px-3 py-2 border border-border rounded-lg"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
        className="w-full px-3 py-2 border border-border rounded-lg"
      />
      <div className="flex gap-3 justify-end pt-4 border-t">
        <ModalClose asChild>
          <Button variant="outline">Cancel</Button>
        </ModalClose>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  </ModalContent>
</Modal>
```

## Best Practices

1. **Always use semantic HTML tags** (main, section, nav, header, footer)
2. **Implement loading states** for async operations
3. **Show error messages** to users
4. **Use proper ARIA labels** for accessibility
5. **Keep components small** and focused
6. **Reuse common components** instead of duplicating
7. **Use Tailwind classes** instead of custom CSS
8. **Add dark mode support** using CSS variables
9. **Make layouts responsive** with mobile-first approach
10. **Test components** in different viewports

## Performance Tips

1. **Memoize expensive components**: `React.memo()`
2. **Use SWR for data fetching**: Automatic caching
3. **Lazy load components**: `React.lazy()` + Suspense
4. **Optimize images**: Use Next.js Image component
5. **Code split**: Automatic in Next.js
6. **Avoid inline functions**: Define outside component
7. **Use useCallback** for function props
8. **Batch state updates**: Use state management
9. **Minimize re-renders**: Track with DevTools
10. **Profile with DevTools**: Identify bottlenecks

---

For more information, refer to the main PLATFORM_GUIDE.md and PROJECT_SUMMARY.md documents.
