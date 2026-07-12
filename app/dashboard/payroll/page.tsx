'use client'

import useSWR from 'swr'
import api from '@/lib/api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, Users, Calendar, Wallet, FileText } from 'lucide-react'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export default function PayrollPage() {
  const { data: stats, isLoading, error } = useSWR('/payroll/stats/', fetcher)

  const cards = [
    {
      title: 'Total Employees',
      value: stats?.total_employees || 0,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Payroll Cycles',
      value: stats?.active_cycles || 0,
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Monthly Payroll',
      value: `₹${(stats?.monthly_payroll || 0).toLocaleString()}`,
      icon: Wallet,
      color: 'text-purple-600',
    },
    {
      title: 'Pending Approvals',
      value: stats?.pending_approvals || 0,
      icon: FileText,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-6 py-6">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>Failed to load payroll stats</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {isLoading ? '—' : card.value}
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${card.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/payroll/salary-structures">
              <Button variant="outline" className="w-full">
                Salary Structures
              </Button>
            </Link>
            <Link href="/dashboard/payroll/payroll-cycles">
              <Button variant="outline" className="w-full">
                Payroll Cycles
              </Button>
            </Link>
            <Link href="/dashboard/payroll/payslips">
              <Button variant="outline" className="w-full">
                Payslips
              </Button>
            </Link>
            <Link href="/dashboard/payroll/reports">
              <Button variant="outline" className="w-full">
                Reports
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>Payroll activities will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
