'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore, useUIStore } from '@/lib/store'
import {
  Menu,
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'

const modules = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'employees', label: 'Employees', icon: Users, href: '/dashboard/employees' },
  { id: 'leave', label: 'Leave & Attendance', icon: Calendar, href: '/dashboard/leave' },
  { id: 'payroll', label: 'Payroll', icon: DollarSign, href: '/dashboard/payroll' },
  { id: 'recruitment', label: 'Recruitment', icon: Briefcase, href: '/dashboard/recruitment' },
  { id: 'learning', label: 'Learning', icon: BookOpen, href: '/dashboard/learning' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { isSidebarOpen, setSidebarOpen, activeModule } = useUIStore()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-200">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              HC
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {modules.map((module) => {
              const Icon = module.icon
              const isActive = activeModule === module.id
              return (
                <Link
                  key={module.id}
                  href={module.href}
                  onClick={() => useUIStore.setState({ activeModule: module.id })}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{module.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-xl font-semibold text-gray-900">HireChamps</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
