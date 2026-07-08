import useSWR from 'swr'
import api from '@/lib/api'

export interface DashboardStats {
  total_employees: number
  active_employees: number
  pending_invites: number
  new_joiners: number
  employees_on_leave: number
}

export interface RecentInvite {
  id: string
  email: string
  name: string
  status: 'pending' | 'accepted' | 'expired'
  sent_date: string
  expires_at: string
}

export interface PendingLeaveRequest {
  id: string
  employee_name: string
  employee_id: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  created_at: string
  days: number
}

export interface ActivityLog {
  id: string
  user_name: string
  action: string
  action_emoji: string
  resource_type: string
  description: string
  timestamp: string
}

export interface UpcomingEvent {
  type: 'birthday' | 'anniversary'
  name: string
  date: string
  employee_id: string
  years?: number
}

export interface Announcement {
  id: string
  title: string
  content: string
  priority: string
  priority_level: number
  author: string
  created_at: string
}

export interface DashboardHRResponse {
  stats: DashboardStats
  recent_invites: RecentInvite[]
  pending_leave_requests: PendingLeaveRequest[]
  recent_activity: ActivityLog[]
  upcoming_events: UpcomingEvent[]
  announcements: Announcement[]
}

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export function useDashboardHR() {
  const { data, error, isLoading, mutate } = useSWR<DashboardHRResponse>(
    '/dashboard/hr/',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Cache for 1 minute
      focusThrottleInterval: 300000, // Revalidate on focus every 5 minutes
    }
  )

  return {
    dashboard: data,
    isLoading,
    error,
    mutate,
  }
}
