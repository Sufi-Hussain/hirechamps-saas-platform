'use client'
import { useAuthStore } from '@/lib/store'
import { Book, Users, Award, BarChart3 } from 'lucide-react'

export default function LearningDashboard() {
  const { user } = useAuthStore()
  const stats = [
    { label: 'Active Programs', value: '12', icon: Book },
    { label: 'Enrolled', value: '234', icon: Users },
    { label: 'Completed', value: '89', icon: Award },
    { label: 'Completion Rate', value: '78%', icon: BarChart3 },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
        <p className="text-gray-600 mt-1">Training programs and employee development</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div><p className="text-sm text-gray-600">{s.label}</p><p className="text-2xl font-bold mt-2">{s.value}</p></div>
              <s.icon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
