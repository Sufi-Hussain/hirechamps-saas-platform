'use client'

import { useAuthStore } from '@/lib/store'
import { Users, CreditCard, TrendingUp, Settings } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CompanyOwnerDashboard() {
  const { organization } = useAuthStore()

  const stats = [
    { label: 'Team Members', value: '24', icon: Users, color: 'text-blue-600' },
    { label: 'Subscription', value: 'Professional', icon: CreditCard, color: 'text-green-600' },
    { label: 'Growth (YoY)', value: '+18%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Employees', value: '23/50', icon: Users, color: 'text-orange-600' },
  ]

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Organization Dashboard</h1>
        <p className="text-gray-600 mt-1">{organization?.name} - Full business overview</p>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Management</h2>
          <div className="space-y-3">
            <Link href="/dashboard/employees">
              <Button variant="outline" className="w-full justify-start">Manage Employees</Button>
            </Link>
            <Link href="/dashboard/department">
              <Button variant="outline" className="w-full justify-start">Departments</Button>
            </Link>
            <Link href="/dashboard/hr">
              <Button variant="outline" className="w-full justify-start">HR Operations</Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full justify-start">Settings</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription & Billing</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-semibold">{organization?.subscription_tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">{organization?.subscription_status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Users Used:</span>
              <span className="font-semibold">{organization?.employees_count} / {organization?.max_employees}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
