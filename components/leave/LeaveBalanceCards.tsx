'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/common/MetricCard'
import { Calendar } from 'lucide-react'

interface LeaveType {
  id: string
  name: string
  available: number
  used: number
  total: number
  color: string
}

interface LeaveBalanceCardsProps {
  leaveTypes?: LeaveType[]
}

export function LeaveBalanceCards({ leaveTypes = [] }: LeaveBalanceCardsProps) {
  const defaultLeaveTypes: LeaveType[] = [
    { id: '1', name: 'Casual Leave', available: 8, used: 2, total: 10, color: 'bg-blue-600' },
    { id: '2', name: 'Sick Leave', available: 5, used: 1, total: 6, color: 'bg-red-600' },
    { id: '3', name: 'Earned Leave', available: 12, used: 0, total: 12, color: 'bg-green-600' },
    { id: '4', name: 'Maternity Leave', available: 90, used: 0, total: 90, color: 'bg-purple-600' },
  ]

  const displayLeaveTypes = leaveTypes.length > 0 ? leaveTypes : defaultLeaveTypes

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayLeaveTypes.map((leave) => (
        <Card key={leave.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <Calendar className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs font-medium px-2 py-1 bg-muted rounded">
                {leave.name}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available</p>
                <p className="text-3xl font-bold">{leave.available}</p>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={leave.color}
                  style={{ width: `${(leave.available / leave.total) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Used: {leave.used}</span>
                <span>Total: {leave.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
