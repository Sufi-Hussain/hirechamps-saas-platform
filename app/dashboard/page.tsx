'use client'
import { useAuthStore } from '@/lib/store'
import { Calendar, Clock, Book, Award } from 'lucide-react'

export default function EmployeeDashboard() {
  const { user } = useAuthStore()
  const stats = [
    { label: 'Leave Balance', value: '12 days', icon: Calendar },
    { label: 'Present This Month', value: '18 days', icon: Clock },
    { label: 'In Progress', value: '2 courses', icon: Book },
    { label: 'Completed', value: '5 certifications', icon: Award },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.first_name}! Here&apos;s your personal overview.</p>
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
