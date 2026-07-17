export const STATUS_VARIANTS = {
  APPROVED: 'success',
  REJECTED: 'destructive',
  PENDING: 'warning',
  DRAFT: 'secondary',
  ACTIVE: 'default',
  INACTIVE: 'outline',
  IN_PROGRESS: 'info',
} as const

export const STATUS_LABELS = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PENDING: 'Pending',
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  IN_PROGRESS: 'In Progress',
} as const

export const ATTENDANCE_STATUS = {
  PRESENT: 'success',
  ABSENT: 'destructive',
  LATE: 'warning',
  WFH: 'info',
  LEAVE: 'secondary',
} as const

export const LEAVE_STATUS = {
  APPROVED: 'success',
  REJECTED: 'destructive',
  PENDING: 'warning',
  CANCELLED: 'outline',
} as const
