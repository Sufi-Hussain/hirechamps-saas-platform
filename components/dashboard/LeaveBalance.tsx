'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LeaveType {
  type: string
  available: number
  used: number
  total: number
  color: string
}

interface LeaveBalanceProps {
  leaveTypes?: LeaveType[]
}

export function LeaveBalance({ leaveTypes = [] }: LeaveBalanceProps) {
  const defaultLeaveTypes: LeaveType[] = [
    { type: 'Casual', available: 8, used: 2, total: 10, color: 'bg-blue-500' },
    { type: 'Sick', available: 5, used: 1, total: 6, color: 'bg-red-500' },
    { type: 'Earned', available: 12, used: 0, total: 12, color: 'bg-green-500' },
    { type: 'Maternity', available: 90, used: 0, total: 90, color: 'bg-purple-500' },
  ]

  const displayLeaveTypes = leaveTypes.length > 0 ? leaveTypes : defaultLeaveTypes

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Balance</CardTitle>
        <CardDescription>All leave types summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayLeaveTypes.map((leave) => (
            <div key={leave.type} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{leave.type} Leave</span>
                <span className="text-sm text-muted-foreground">
                  {leave.available}/{leave.total} days
                </span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${leave.color}`}
                  style={{ width: `${(leave.available / leave.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
