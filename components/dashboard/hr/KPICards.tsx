'use client'

import useSWR from 'swr'
import api from '@/lib/api'
import {
  Users,
  UserCheck,
  Clock,
  CalendarDays,
  AlertCircle,
} from 'lucide-react'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

interface KPICard {
  label: string
  icon: React.ComponentType<{ className: string }>
  color: string
  endpoint: string
  dataKey: string
}

const kpiCards: KPICard[] = [
  {
    label: 'Total Employees',
    icon: Users,
    color: 'blue',
    endpoint: '/employees/stats/',
    dataKey: 'total',
  },
  {
    label: 'Active Employees',
    icon: UserCheck,
    color: 'green',
    endpoint: '/employees/stats/',
    dataKey: 'active',
  },
  {
    label: 'Pending Invitations',
    icon: Clock,
    color: 'yellow',
    endpoint: '/invites/stats/',
    dataKey: 'pending',
  },
  {
    label: 'New Joinees (This Month)',
    icon: CalendarDays,
    color: 'purple',
    endpoint: '/employees/stats/',
    dataKey: 'new_this_month',
  },
  {
    label: 'Employees on Leave Today',
    icon: AlertCircle,
    color: 'red',
    endpoint: '/leave/today/',
    dataKey: 'count',
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
  const { data: employeeStats, isLoading: employeeLoading } = useSWR(
    '/employees/stats/',
    fetcher
  )
  const { data: inviteStats, isLoading: inviteLoading } = useSWR(
    '/invites/stats/',
    fetcher
  )
  const { data: leaveToday, isLoading: leaveLoading } = useSWR(
    '/leave/today/',
    fetcher
  )

  const isLoading = employeeLoading || inviteLoading || leaveLoading

  const getKPIValue = (card: KPICard) => {
    if (isLoading) return '—'

    if (card.endpoint === '/employees/stats/') {
      return employeeStats?.[card.dataKey] ?? 0
    }
    if (card.endpoint === '/invites/stats/') {
      return inviteStats?.[card.dataKey] ?? 0
    }
    if (card.endpoint === '/leave/today/') {
      return leaveToday?.[card.dataKey] ?? 0
    }

    return 0
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpiCards.map((card) => {
        const Icon = card.icon
        const value = getKPIValue(card)

        if (isLoading && (employeeLoading || inviteLoading || leaveLoading)) {
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
