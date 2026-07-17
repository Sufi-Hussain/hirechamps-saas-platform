'use client'

import { useAuthStore } from '@/lib/store'
import { QuickStatistics } from '@/components/dashboard/QuickStatistics'
import { TodaySchedule } from '@/components/dashboard/TodaySchedule'
import { AttendanceSummary } from '@/components/dashboard/AttendanceSummary'
import { LeaveBalance } from '@/components/dashboard/LeaveBalance'
import { AnnouncementsFeed } from '@/components/dashboard/AnnouncementsFeed'
import { RecentActivity } from '@/components/dashboard/RecentActivity'

export default function EmployeeDashboard() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.first_name}!</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s your personal dashboard overview. Stay on top of your work, leave, and performance.
        </p>
      </div>

      {/* Quick Statistics */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
        <QuickStatistics />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Schedule and Attendance */}
        <div className="lg:col-span-2 space-y-6">
          <TodaySchedule />
          <AttendanceSummary />
        </div>

        {/* Right Column - Leave Balance */}
        <div>
          <LeaveBalance />
        </div>
      </div>

      {/* Bottom Row - Announcements and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnnouncementsFeed />
        <RecentActivity />
      </div>
    </div>
  )
}
