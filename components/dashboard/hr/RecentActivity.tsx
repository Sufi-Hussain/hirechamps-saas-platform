'use client'

import { format } from 'date-fns'
import { AlertCircle } from 'lucide-react'
import { useDashboardHR, ActivityLog } from '@/hooks/useDashboardHR'

function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 p-4 bg-gray-100 rounded animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

const actionIcons: Record<string, string> = {
  create: '➕',
  update: '✏️',
  delete: '🗑️',
  approve: '✅',
  reject: '❌',
  login: '🔓',
}

export default function RecentActivity() {
  const { dashboard, isLoading, error } = useDashboardHR()
  const activities = dashboard?.recent_activity || []

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <ActivitySkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>Failed to load activity. Please try again.</p>
        </div>
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity Feed</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {data.map((activity: ActivityLog) => (
          <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="text-2xl">
                {actionIcons[activity.action.toLowerCase()] || '📋'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {activity.user.first_name} {activity.user.last_name}{' '}
                  <span className="text-gray-600 font-normal">
                    {activity.action.toLowerCase()}d
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {format(new Date(activity.timestamp), 'MMM dd, yyyy • h:mm a')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
