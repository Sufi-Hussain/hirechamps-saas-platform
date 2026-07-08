export interface KPIMetrics {
  totalEmployees: number
  activeEmployees: number
  pendingInvitations: number
  newJoinees: number
  onLeaveToday: number
}

export interface EmployeeInvitation {
  id: string
  email: string
  firstName: string
  lastName: string
  status: 'pending' | 'accepted' | 'expired'
  sentDate: string
  expiresAt: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveType: string
  startDate: string
  endDate: string
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
}

export interface ActivityLog {
  id: string
  action: string
  resource: string
  user: string
  timestamp: string
  description: string
}

export interface UpcomingEvent {
  id: string
  employeeName: string
  eventType: 'birthday' | 'anniversary'
  date: string
  yearsOfService?: number
}

export interface Announcement {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

export interface Holiday {
  id: string
  name: string
  date: string
  type: 'national' | 'company'
}
