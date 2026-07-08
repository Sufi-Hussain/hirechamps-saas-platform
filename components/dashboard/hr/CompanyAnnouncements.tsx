'use client'

import { format } from 'date-fns'
import { AlertCircle, Megaphone } from 'lucide-react'
import { useDashboardHR, Announcement } from '@/hooks/useDashboardHR'

function AnnouncementSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border border-gray-200 rounded animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )
}

const priorityColors = {
  low: 'bg-blue-50 border-blue-200 text-blue-700',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  high: 'bg-red-50 border-red-200 text-red-700',
}

export default function CompanyAnnouncements() {
  const { dashboard, isLoading, error } = useDashboardHR()
  const announcements = dashboard?.announcements || []

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Company Announcements
        </h3>
        <AnnouncementSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Company Announcements
        </h3>
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <p>Failed to load announcements</p>
        </div>
      </div>
    )
  }

  if (!announcements || announcements.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Company Announcements
        </h3>
        <p className="text-sm text-gray-500 text-center py-4">No announcements</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Megaphone className="h-5 w-5" />
        Company Announcements
      </h3>
      <div className="space-y-3">
        {announcements.map((announcement: Announcement) => (
          <div
            key={announcement.id}
            className={`p-4 border rounded-lg ${
              priorityColors[announcement.priority as keyof typeof priorityColors]
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{announcement.title}</h4>
                <p className="text-xs mt-1 opacity-90">{announcement.content}</p>
                <p className="text-xs mt-2 opacity-75">
                  By {announcement.author} •{' '}
                  {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                  announcement.priority === 'high'
                    ? 'bg-red-100 text-red-800'
                    : announcement.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                }`}
              >
                {announcement.priority.charAt(0).toUpperCase() +
                  announcement.priority.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
