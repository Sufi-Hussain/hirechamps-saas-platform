'use client'
import { useAuthStore } from '@/lib/store'
import { Shield, BarChart3, Clock, AlertCircle } from 'lucide-react'

export default function AuditDashboard() {
  const { user } = useAuthStore()
  const stats = [
    { label: 'Audit Logs', value: '2,456', icon: Shield },
    { label: 'Compliance Score', value: '98%', icon: BarChart3 },
    { label: 'Last Scan', value: '2 hours ago', icon: Clock },
    { label: 'Issues Found', value: '0', icon: AlertCircle },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit Dashboard</h1>
        <p className="text-gray-600 mt-1">Compliance monitoring and audit trails</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div><p className="text-sm text-gray-600">{s.label}</p><p className="text-2xl font-bold mt-2">{s.value}</p></div>
              <s.icon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
