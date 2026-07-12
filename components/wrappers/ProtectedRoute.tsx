'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { AlertCircle } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: string[]
  requiredPermissions?: string[]
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  requiredRoles,
  requiredPermissions,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, roles, permissions } = useAuthStore()

  // Check permissions
  const hasRequiredRoles =
    !requiredRoles || requiredRoles.length === 0 || requiredRoles.some((role) => roles.includes(role))

  const hasRequiredPermissions =
    !requiredPermissions ||
    requiredPermissions.length === 0 ||
    requiredPermissions.every((perm) => permissions.includes(perm))

  const hasAccess = isAuthenticated && hasRequiredRoles && hasRequiredPermissions

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else if (!hasAccess) {
      router.push('/access-denied')
    }
  }, [isAuthenticated, hasAccess, router])

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
