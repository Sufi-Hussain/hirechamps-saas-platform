import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  UserPlus,
  Users,
  LogOut,
  FileText,
  DollarSign,
  Clock,
} from 'lucide-react'

interface QuickAction {
  label: string
  icon: React.ComponentType<{ className: string }>
  href: string
  color: string
}

const actions: QuickAction[] = [
  {
    label: 'Invite Employee',
    icon: UserPlus,
    href: '/dashboard/hr/invite-employee',
    color: 'blue',
  },
  {
    label: 'View Employees',
    icon: Users,
    href: '/dashboard/employees',
    color: 'green',
  },
  {
    label: 'Leave Requests',
    icon: LogOut,
    href: '/dashboard/leave',
    color: 'yellow',
  },
  {
    label: 'Payroll',
    icon: DollarSign,
    href: '/dashboard/payroll',
    color: 'purple',
  },
  {
    label: 'Attendance',
    icon: Clock,
    href: '/dashboard/attendance',
    color: 'red',
  },
  {
    label: 'Reports',
    icon: FileText,
    href: '/dashboard/analytics',
    color: 'indigo',
  },
]

const colorVariants = {
  blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  green: 'bg-green-50 text-green-600 hover:bg-green-100',
  yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
  purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  red: 'bg-red-50 text-red-600 hover:bg-red-100',
  indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
}

export default function QuickActions() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.label} href={action.href}>
              <button
                className={`w-full p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md ${
                  colorVariants[action.color as keyof typeof colorVariants]
                }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium text-center">{action.label}</p>
              </button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
