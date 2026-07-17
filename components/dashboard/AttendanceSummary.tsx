'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, LogIn, LogOut } from 'lucide-react'

interface AttendanceSummaryProps {
  checkedIn?: boolean
  checkInTime?: string
  checkOutTime?: string
  workHours?: string
  wfhStatus?: boolean
}

export function AttendanceSummary({
  checkedIn = true,
  checkInTime = '09:30 AM',
  checkOutTime = '06:00 PM',
  workHours = '8h 30m',
  wfhStatus = false,
}: AttendanceSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Attendance Status
        </CardTitle>
        <CardDescription>Today&apos;s check-in details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
            <span className="text-sm font-medium">Status</span>
            <Badge variant={checkedIn ? 'success' : 'warning'}>
              {checkedIn ? 'Checked In' : 'Not Checked In'}
            </Badge>
          </div>

          {/* Check-in/Check-out */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <LogIn className="h-4 w-4 text-green-600" />
                <span className="text-xs text-muted-foreground">Check-in</span>
              </div>
              <p className="text-sm font-medium">{checkInTime}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <LogOut className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-muted-foreground">Check-out</span>
              </div>
              <p className="text-sm font-medium">{checkOutTime || '-'}</p>
            </div>
          </div>

          {/* Work Hours */}
          <div className="p-3 bg-muted/50 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Work Hours Today</span>
            <p className="text-lg font-bold mt-1">{workHours}</p>
          </div>

          {/* WFH Status */}
          {wfhStatus && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                ✓ Working from Home Today
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
