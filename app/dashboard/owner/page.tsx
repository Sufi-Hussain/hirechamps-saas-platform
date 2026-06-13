'use client'
import { useAuthStore } from '@/lib/store'
import { Users, CreditCard, TrendingUp, BarChart3 } from 'lucide-react'

export default function CompanyOwnerDashboard() {
  const { user, organization } = useAuthStore()
  const stats = [
    { label: 'Team Members', value: '24', icon: Users },
    { label: 'Subscription', value: 'Professional', icon: CreditCard },
    { label: 'Growth', value: '+18%', icon: TrendingUp },
    { label: 'Active Projects', value: '8', icon: BarChart3 },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
        <p className="text-gray-600 mt-1">{organization?.name} - Full business overview</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div><p className="text-sm text-gray-600">{s.label}</p><p className="text-2xl font-bold mt-2">{s.value}</p></div>
              <s.icon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
