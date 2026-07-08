'use client'

import {
  Users,
  UserCheck,
  Clock,
  CalendarDays,
  AlertCircle,
} from 'lucide-react'
import { useDashboardHR } from '@/hooks/useDashboardHR'

interface KPICard {
  label: string
  icon: React.ComponentType<{ className: string }>
  color: string
  dataKey: 'total_employees' | 'active_employees' | 'pending_invites' | 'new_joiners' | 'employees_on_leave'
}

const kpiCards: KPICard[] = [
  {
    label: 'Total Employees',
    icon: Users,
    color: 'blue',
    dataKey: 'total_employees',
  },
  {
    label: 'Active Employees',
    icon: UserCheck,
    color: 'green',
    dataKey: 'active_employees',
  },
  {
    label: 'Pending Invitations',
    icon: Clock,
    color: 'yellow',
    dataKey: 'pending_invites',
  },
  {
    label: 'New Joinees (This Month)',
    icon: CalendarDays,
    color: 'purple',
    dataKey: 'new_joiners',
  },
  {
    label: 'Employees on Leave Today',
    icon: AlertCircle,
    color: 'red',
    dataKey: 'employees_on_leave',
  },
]

function KPICardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-12 w-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

const colorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  purple: 'text-purple-600',
  red: 'text-red-600',
}

export default function KPICards() {
  const { dashboard, isLoading } = useDashboardHR()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpiCards.map((card) => {
        const Icon = card.icon
        const value = isLoading ? '—' : (dashboard?.stats[card.dataKey] ?? 0)

        if (isLoading) {
          return <KPICardSkeleton key={card.label} />
        }

        return (
          <div
            key={card.label}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
              </div>
              <Icon className={`h-8 w-8 ${colorClasses[card.color]}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
