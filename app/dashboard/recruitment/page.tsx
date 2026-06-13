'use client'
import { useAuthStore } from '@/lib/store'
import { Briefcase, Users, TrendingUp, FileText } from 'lucide-react'

export default function RecruitmentDashboard() {
  const { user } = useAuthStore()
  const stats = [
    { label: 'Open Positions', value: '8', icon: Briefcase },
    { label: 'Active Candidates', value: '47', icon: Users },
    { label: 'Hire Rate', value: '32%', icon: TrendingUp },
    { label: 'Avg Time to Hire', value: '28 days', icon: FileText },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Recruitment Dashboard</h1>
        <p className="text-gray-600 mt-1">Job postings, candidates, and hiring pipeline</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div><p className="text-sm text-gray-600">{s.label}</p><p className="text-2xl font-bold mt-2">{s.value}</p></div>
              <s.icon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
