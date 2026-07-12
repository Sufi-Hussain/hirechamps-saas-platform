'use client'

import { Building2, Users, CreditCard, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PlatformAdminDashboard() {
  const stats = [
    { label: 'Total Organizations', value: '45', icon: Building2, color: 'text-blue-600' },
    { label: 'Active Users', value: '892', icon: Users, color: 'text-green-600' },
    { label: 'Monthly Revenue', value: '$45,230', icon: CreditCard, color: 'text-purple-600' },
    { label: 'System Alerts', value: '2', icon: AlertCircle, color: 'text-red-600' },
  ]

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Administration</h1>
        <p className="text-gray-600 mt-1">System-wide overview and management</p>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Management</h2>
          <div className="space-y-3">
            <Link href="/admin/organizations">
              <Button variant="outline" className="w-full justify-start">Organizations</Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">Users & Roles</Button>
            </Link>
            <Link href="/admin/subscriptions">
              <Button variant="outline" className="w-full justify-start">Subscriptions</Button>
            </Link>
            <Link href="/dashboard/audit">
              <Button variant="outline" className="w-full justify-start">Audit Logs</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email Service:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">Degraded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
