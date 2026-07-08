'use client'

import { useAuthStore } from '@/lib/store'
import { format } from 'date-fns'
import {
  Users,
  UserCheck,
  Clock,
  CalendarDays,
  UserPlus,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import WelcomeHeader from '@/components/dashboard/hr/WelcomeHeader'
import KPICards from '@/components/dashboard/hr/KPICards'
import QuickActions from '@/components/dashboard/hr/QuickActions'
import RecentInvitations from '@/components/dashboard/hr/RecentInvitations'
import PendingLeaveRequests from '@/components/dashboard/hr/PendingLeaveRequests'
import RecentActivity from '@/components/dashboard/hr/RecentActivity'
import UpcomingEventsWidget from '@/components/dashboard/hr/UpcomingEventsWidget'
import CompanyAnnouncements from '@/components/dashboard/hr/CompanyAnnouncements'
import CalendarWidget from '@/components/dashboard/hr/CalendarWidget'

export default function HRDashboard() {
  const { user, organization } = useAuthStore()

  if (!user || !organization) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <WelcomeHeader
        userName={user.first_name}
        organizationName={organization.name}
        currentDate={format(new Date(), 'EEEE, MMMM d, yyyy')}
      />

      {/* KPI Cards */}
      <KPICards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Wide */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Invitations */}
          <RecentInvitations />

          {/* Pending Leave Requests */}
          <PendingLeaveRequests />

          {/* Recent Activity */}
          <RecentActivity />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Calendar Widget */}
          <CalendarWidget />

          {/* Upcoming Events */}
          <UpcomingEventsWidget />

          {/* Company Announcements */}
          <CompanyAnnouncements />
        </div>
      </div>
    </div>
  )
}
