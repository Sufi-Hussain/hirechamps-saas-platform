'use client'
import { useAuthStore } from '@/lib/store'
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react'

export default function DepartmentDashboard() {
  const { user } = useAuthStore()
  const stats = [
    { label: 'Team Size', value: '24', icon: Users },
    { label: 'Leave Requests', value: '5', icon: Calendar },
    { label: 'Present Today', value: '23', icon: Clock },
    { label: 'Performance', value: '8.5/10', icon: TrendingUp },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Department Dashboard</h1>
        <p className="text-gray-600 mt-1">Team management and performance tracking</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div><p className="text-sm text-gray-600">{s.label}</p><p className="text-2xl font-bold mt-2">{s.value}</p></div>
              <s.icon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
