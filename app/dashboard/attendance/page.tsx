'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckInButton } from '@/components/attendance/CheckInButton'
import { AttendanceTable } from '@/components/attendance/AttendanceTable'
import { MetricCard } from '@/components/common/MetricCard'
import { Calendar, BarChart3, Clock } from 'lucide-react'

export default function AttendancePage() {
  const [isCheckedIn, setIsCheckedIn] = useState(true)

  const handleCheckIn = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsCheckedIn(true)
  }

  const handleCheckOut = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsCheckedIn(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Attendance Management</h1>
        <p className="text-muted-foreground mt-2">Track your daily check-in/check-out and attendance records</p>
      </div>

      {/* Check-in Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Today&apos;s Check-in</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CheckInButton
              isCheckedIn={isCheckedIn}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
            />
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <MetricCard
              icon={<Clock className="h-6 w-6" />}
              label="Work Hours"
              value="8h 30m"
              description="Today"
            />
            <MetricCard
              icon={<Calendar className="h-6 w-6" />}
              label="This Month"
              value="18 days"
              description="Present"
            />
          </div>
        </div>
      </section>

      {/* Quick Stats Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Attendance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Calendar className="h-6 w-6" />}
            label="Present Days"
            value="18"
            description="This month"
            trend={{ direction: 'up', value: 5 }}
          />
          <MetricCard
            icon={<Clock className="h-6 w-6" />}
            label="Late Arrivals"
            value="2"
            description="This month"
            trend={{ direction: 'down', value: 50 }}
          />
          <MetricCard
            icon={<BarChart3 className="h-6 w-6" />}
            label="Attendance %"
            value="95%"
            description="Monthly average"
            trend={{ direction: 'up', value: 2 }}
          />
          <MetricCard
            icon={<Clock className="h-6 w-6" />}
            label="Overtime Hours"
            value="12h"
            description="This month"
          />
        </div>
      </section>

      {/* Navigation Tabs */}
      <section>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Link href="/dashboard/attendance">
            <Button variant="default">History</Button>
          </Link>
          <Link href="/dashboard/attendance/calendar">
            <Button variant="outline">Calendar View</Button>
          </Link>
          <Link href="/dashboard/attendance/analytics">
            <Button variant="outline">Analytics</Button>
          </Link>
        </div>

        {/* Attendance History Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
          <AttendanceTable />
        </div>
      </section>
    </div>
  )
}
