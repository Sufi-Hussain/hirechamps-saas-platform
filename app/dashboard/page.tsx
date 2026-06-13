'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Users, Calendar, DollarSign, Briefcase, TrendingUp, Clock } from 'lucide-react'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export default function Dashboard() {
  const { user, organization } = useAuthStore()
  const [stats, setStats] = useState({
    total_employees: 0,
    active_employees: 0,
    pending_leaves: 0,
    open_positions: 0,
  })

  const { data: employees } = useSWR('/employees/?limit=5', fetcher)
  const { data: leaves } = useSWR('/leave-requests/?status=pending', fetcher)
  const { data: jobs } = useSWR('/job-postings/active/', fetcher)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, leaveRes, jobRes] = await Promise.all([
          api.get('/employees/?limit=1'),
          api.get('/leave-requests/?status=pending&limit=1'),
          api.get('/job-postings/active/?limit=1'),
        ])

        setStats({
          total_employees: empRes.data.count || 0,
          active_employees: Math.floor((empRes.data.count || 0) * 0.9),
          pending_leaves: leaveRes.data.count || 0,
          open_positions: jobRes.data.count || 0,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      label: 'Total Employees',
      value: stats.total_employees,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Active Employees',
      value: stats.active_employees,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Pending Leaves',
      value: stats.pending_leaves,
      icon: Calendar,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Open Positions',
      value: stats.open_positions,
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.first_name}!</h1>
        <p className="text-gray-600 mt-1">Here&apos;s what&apos;s happening in your organization today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Employees */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Employees</h2>
            <a href="/dashboard/employees" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </a>
          </div>

          {employees?.results && employees.results.length > 0 ? (
            <div className="space-y-4">
              {employees.results.map((emp: any) => (
                <div key={emp.id} className="flex items-start justify-between pb-4 border-b border-gray-200 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">{emp.user_name}</p>
                      <p className="text-sm text-gray-600">{emp.designation_name}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {emp.employment_status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No employees yet. Add your first employee to get started.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/dashboard/employees?action=add"
              className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition"
            >
              + Add Employee
            </a>
            <a
              href="/dashboard/leave?action=approve"
              className="block w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-center font-medium transition"
            >
              Review Leaves
            </a>
            <a
              href="/dashboard/recruitment?action=post"
              className="block w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-center font-medium transition"
            >
              Post Job
            </a>
            <a
              href="/dashboard/payroll"
              className="block w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-center font-medium transition"
            >
              Generate Slips
            </a>
          </div>
        </div>
      </div>

      {/* Pending Leaves */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pending Leave Approvals</h2>
          <a href="/dashboard/leave" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All →
          </a>
        </div>

        {leaves?.results && leaves.results.length > 0 ? (
          <div className="space-y-3">
            {leaves.results.slice(0, 5).map((leave: any) => (
              <div key={leave.id} className="flex items-start justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="font-medium text-gray-900">{leave.employee_id}</p>
                  <p className="text-sm text-gray-600">
                    {leave.leave_type_name} • {leave.start_date} to {leave.end_date}
                  </p>
                </div>
                <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition">
                  Approve
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No pending leave requests</p>
        )}
      </div>
    </div>
  )
}
