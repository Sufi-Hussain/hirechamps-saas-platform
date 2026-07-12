'use client'

import { BarChart3, TrendingUp, Users, PieChart, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AnalyticsPage() {
  const metrics = [
    { label: 'Total Employees', value: '245', change: '+12%', icon: Users, color: 'text-blue-600' },
    { label: 'Revenue', value: '$124.5K', change: '+8%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Avg Performance', value: '8.2/10', change: '+2%', icon: BarChart3, color: 'text-purple-600' },
    { label: 'Retention Rate', value: '94%', change: '+5%', icon: PieChart, color: 'text-orange-600' },
  ]

  const departmentStats = [
    { name: 'Engineering', employees: 45, revenue: '$52K', rating: 4.5 },
    { name: 'Sales', employees: 30, revenue: '$45K', rating: 4.2 },
    { name: 'HR', employees: 12, revenue: '$15K', rating: 4.7 },
    { name: 'Operations', employees: 28, revenue: '$32K', rating: 4.1 },
  ]

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">View dashboards, reports, and organizational insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <p className="text-xs text-green-600 mt-1">{metric.change} vs last month</p>
                </div>
                <Icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h2>
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{dept.name}</p>
                  <p className="text-sm text-gray-600">{dept.employees} employees</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{dept.revenue}</p>
                  <p className="text-sm text-yellow-600">★ {dept.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hiring Trends</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Q1 Hires</span>
                <span className="text-sm font-semibold text-gray-900">28</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '56%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Q2 Hires</span>
                <span className="text-sm font-semibold text-gray-900">35</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Q3 Hires</span>
                <span className="text-sm font-semibold text-gray-900">22</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '44%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
          <Button variant="outline" size="sm">Download All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Monthly Report', 'Quarterly Summary', 'Annual Review'].map((report) => (
            <div key={report} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <p className="font-medium text-gray-900">{report}</p>
              </div>
              <Button size="sm" variant="outline" className="w-full">Download</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
