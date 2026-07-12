'use client'

import { Users, Users2, Shield, Activity } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ManagerDashboard() {
  const stats = [
    { label: 'Team Members', value: '12', icon: Users, color: 'text-blue-600' },
    { label: 'Direct Reports', value: '8', icon: Users2, color: 'text-green-600' },
    { label: 'Team Roles', value: '4', icon: Shield, color: 'text-purple-600' },
    { label: 'Team Activity', value: '89%', icon: Activity, color: 'text-orange-600' },
  ]

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your team, approvals, and performance</p>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Management</h2>
          <div className="space-y-3">
            <Link href="/dashboard/employees">
              <Button variant="outline" className="w-full justify-start">View Team</Button>
            </Link>
            <Link href="/dashboard/leave">
              <Button variant="outline" className="w-full justify-start">Leave Approvals</Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full justify-start">Performance</Button>
            </Link>
            <Link href="/dashboard/attendance">
              <Button variant="outline" className="w-full justify-start">Attendance</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leave Requests:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">3 pending</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reimbursements:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">2 pending</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Performance Reviews:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">0 pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
