'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { Loader } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, roles, dashboardRoute, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login')
      return
    }

    // Route based on dashboardRoute from backend or fallback to role-based routing
    if (dashboardRoute && dashboardRoute !== '/dashboard') {
      router.push(dashboardRoute)
    } else {
      // Fallback routing based on roles
      if (roles.includes('super_admin')) {
        router.push('/dashboard/platform-admin')
      } else if (roles.includes('org_admin') || roles.includes('admin')) {
        router.push('/dashboard/owner')
      } else if (roles.includes('hr')) {
        router.push('/dashboard/hr')
      } else if (roles.includes('payroll_manager')) {
        router.push('/dashboard/payroll')
      } else if (roles.includes('manager')) {
        router.push('/dashboard/admin')
      } else {
        // Default to employee dashboard
        router.push('/dashboard/employee')
      }
    }
  }, [isAuthenticated, user, dashboardRoute, roles, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
