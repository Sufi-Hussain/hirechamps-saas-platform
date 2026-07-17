'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'

export default function AttendanceCalendarPage() {
  const daysInMonth = 31
  const firstDayOfWeek = 3 // Wednesday (July 1, 2024)
  const attendanceData: Record<number, { status: 'present' | 'absent' | 'late' | 'wfh' }> = {
    1: { status: 'present' },
    2: { status: 'present' },
    3: { status: 'present' },
    4: { status: 'late' },
    5: { status: 'present' },
    8: { status: 'wfh' },
    9: { status: 'present' },
    10: { status: 'present' },
    11: { status: 'absent' },
    12: { status: 'present' },
  }

  const statusColors = {
    present: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    absent: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    late: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
    wfh: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  }

  const statusLabels = {
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    wfh: 'WFH',
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/attendance">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Attendance Calendar</h1>
          <p className="text-muted-foreground">July 2024</p>
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statusLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${statusColors[key as any].split(' ')[0]}`}></div>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center font-semibold text-sm p-2">
                {day}
              </div>
            ))}

            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-4"></div>
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const attendance = attendanceData[day]

              return (
                <div
                  key={day}
                  className={`p-3 rounded-lg border ${
                    attendance
                      ? statusColors[attendance.status]
                      : 'bg-muted/50 border-border'
                  } text-center cursor-pointer hover:shadow-sm transition`}
                >
                  <div className="font-semibold text-sm mb-1">{day}</div>
                  {attendance && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      {statusLabels[attendance.status]}
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
