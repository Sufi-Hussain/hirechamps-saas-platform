'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get days from previous month to fill the grid
  const firstDayOfWeek = monthStart.getDay()
  const previousMonthDays = eachDayOfInterval({
    start: new Date(monthStart.getFullYear(), monthStart.getMonth(), 1 - firstDayOfWeek),
    end: new Date(monthStart.getFullYear(), monthStart.getMonth(), 0),
  }).slice(-firstDayOfWeek)

  // Get days from next month to fill the grid
  const lastDayOfWeek = monthEnd.getDay()
  const nextMonthDays = eachDayOfInterval({
    start: new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 1),
    end: new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 42 - days.length - previousMonthDays.length),
  })

  const allDays = [...previousMonthDays, ...days, ...nextMonthDays]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, today)

          return (
            <button
              key={idx}
              className={`aspect-square rounded text-sm font-medium transition-colors
                ${!isCurrentMonth ? 'text-gray-300 bg-gray-50' : ''}
                ${isToday ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                ${isCurrentMonth && !isToday ? 'text-gray-900 hover:bg-gray-100' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Today: {format(today, 'MMM dd, yyyy')}
        </p>
      </div>
    </div>
  )
}
