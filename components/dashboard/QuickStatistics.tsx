'use client'

import { MetricCard } from '@/components/common/MetricCard'
import { Calendar, Clock, CheckCircle, Target } from 'lucide-react'

interface QuickStatisticsProps {
  leaveBalance?: number
  daysPresent?: number
  pendingApprovals?: number
  goalProgress?: number
}

export function QuickStatistics({
  leaveBalance = 12,
  daysPresent = 18,
  pendingApprovals = 2,
  goalProgress = 65,
}: QuickStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        icon={<Calendar className="h-6 w-6" />}
        label="Leave Balance"
        value={`${leaveBalance} days`}
        description="Remaining for this year"
        trend={leaveBalance > 5 ? { direction: 'up', value: 8 } : { direction: 'down', value: 15 }}
      />
      <MetricCard
        icon={<Clock className="h-6 w-6" />}
        label="Present This Month"
        value={`${daysPresent} days`}
        description="Working days"
        trend={{ direction: 'up', value: 5, label: 'vs last month' }}
      />
      <MetricCard
        icon={<CheckCircle className="h-6 w-6" />}
        label="Pending Approvals"
        value={pendingApprovals}
        description="Awaiting review"
      />
      <MetricCard
        icon={<Target className="h-6 w-6" />}
        label="Goal Progress"
        value={`${goalProgress}%`}
        description="Current quarter"
        trend={goalProgress >= 50 ? { direction: 'up', value: 12 } : { direction: 'down', value: 8 }}
      />
    </div>
  )
}
