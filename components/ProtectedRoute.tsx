'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string | string[]
  requiredPermissions?: string | string[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredRoles,
  requiredPermissions,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, hasRole, hasPermission, hasAnyPermission } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    // Check role requirements
    if (requiredRoles) {
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
      if (!hasRole(roles)) {
        router.push('/access-denied')
        return
      }
    }

    // Check permission requirements
    if (requiredPermissions) {
      const perms = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]
      if (!hasAnyPermission(perms)) {
        router.push('/access-denied')
        return
      }
    }
  }, [isAuthenticated, requiredRoles, requiredPermissions])

  if (!isAuthenticated) {
    return fallback || <div>Loading...</div>
  }

  // Check role requirements
  if (requiredRoles) {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    if (!hasRole(roles)) {
      return fallback || <div>Access Denied</div>
    }
  }

  // Check permission requirements
  if (requiredPermissions) {
    const perms = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]
    if (!hasAnyPermission(perms)) {
      return fallback || <div>Access Denied</div>
    }
  }

  return <>{children}</>
}

interface PermissionGuardProps {
  permission: string | string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasAnyPermission } = useAuthStore()

  const perms = Array.isArray(permission) ? permission : [permission]
  if (!hasAnyPermission(perms)) {
    return fallback
  }

  return <>{children}</>
}

interface RoleGuardProps {
  roles: string | string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({
  roles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { hasRole } = useAuthStore()

  if (!hasRole(roles)) {
    return fallback
  }

  return <>{children}</>
}
