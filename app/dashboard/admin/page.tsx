'use client'
import { useAuthStore } from '@/lib/store'
import { Users, Settings, Shield, Activity } from 'lucide-react'

export default function TenantAdminDashboard() {
  const { user } = useAuthStore()
  const stats = [
    { label: 'Total Employees', value: '156', icon: Users },
    { label: 'Departments', value: '12', icon: Settings },
    { label: 'Active Roles', value: '8', icon: Shield },
    { label: 'System Activity', value: '2.4K/day', icon: Activity },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Organization administration and configuration</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div><p className="text-sm text-gray-600">{s.label}</p><p className="text-2xl font-bold mt-2">{s.value}</p></div>
              <s.icon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
