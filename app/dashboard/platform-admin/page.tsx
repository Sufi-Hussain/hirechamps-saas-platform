'use client'
import { useAuthStore } from '@/lib/store'
import { Building, Users, CreditCard, BarChart3 } from 'lucide-react'

export default function PlatformAdminDashboard() {
  const { user } = useAuthStore()
  const stats = [
    { label: 'Total Organizations', value: '45', icon: Building },
    { label: 'Active Users', value: '892', icon: Users },
    { label: 'Monthly Revenue', value: '$45,230', icon: CreditCard },
    { label: 'System Health', value: '99.8%', icon: BarChart3 },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Administration</h1>
        <p className="text-gray-600 mt-1">System-wide overview and management</p>
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
