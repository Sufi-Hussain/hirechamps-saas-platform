'use client'

import { format } from 'date-fns'
import { AlertCircle, Cake, Award } from 'lucide-react'
import { useDashboardHR, UpcomingEvent } from '@/hooks/useDashboardHR'

function EventSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-gray-100 rounded animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function UpcomingEventsWidget() {
  const { dashboard, isLoading, error } = useDashboardHR()
  const events = dashboard?.upcoming_events || []

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Birthdays & Anniversaries</h3>
        <EventSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Birthdays & Anniversaries</h3>
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <p>Failed to load events</p>
        </div>
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Birthdays & Anniversaries</h3>
        <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Upcoming Birthdays & Anniversaries</h3>
      <div className="space-y-3">
        {events.map((event: UpcomingEvent) => (
          <div
            key={`${event.type}-${event.employee_id}-${event.date}`}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0">
              {event.type === 'birthday' ? (
                <Cake className="h-5 w-5 text-blue-600" />
              ) : (
                <Award className="h-5 w-5 text-purple-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{event.name}</p>
              <p className="text-xs text-gray-600">
                {event.type === 'birthday'
                  ? `Birthday on ${format(new Date(event.date), 'MMM dd')}`
                  : `${event.years} years with us on ${format(
                      new Date(event.date),
                      'MMM dd'
                    )}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
