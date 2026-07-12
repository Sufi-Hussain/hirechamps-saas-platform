'use client'

import { useAuthStore } from '@/lib/store'
import { Calendar, Clock, DollarSign, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function EmployeeDashboard() {
  const { user, organization } = useAuthStore()

  const stats = [
    { label: 'Leave Balance', value: '12 days', icon: Calendar, color: 'text-blue-600' },
    { label: 'Present This Month', value: '18 days', icon: Clock, color: 'text-green-600' },
    { label: 'Salary (Current)', value: '₹50,000', icon: DollarSign, color: 'text-purple-600' },
    { label: 'Payslips', value: '11', icon: FileText, color: 'text-orange-600' },
  ]

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.first_name}!</h1>
        <p className="text-gray-600 mt-1">{organization?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/employee/profile">
              <Button variant="outline" className="w-full">View Profile</Button>
            </Link>
            <Link href="/dashboard/employee/payslips">
              <Button variant="outline" className="w-full">View Payslips</Button>
            </Link>
            <Link href="/dashboard/leave">
              <Button variant="outline" className="w-full">Apply Leave</Button>
            </Link>
            <Link href="/dashboard/employee/attendance">
              <Button variant="outline" className="w-full">Attendance</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Leave Balance:</span>
              <span className="font-semibold">12 / 20 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Attendance Rate:</span>
              <span className="font-semibold">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Payslip:</span>
              <span className="font-semibold">March 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
