'use client'

import { ReactNode } from 'react'
import { useRbac } from '@/hooks/useRbac'

interface CanAccessProps {
  children: ReactNode
  roles?: string[]
  permissions?: string[]
  fallback?: ReactNode
  requireAll?: boolean // If true, require all permissions/roles. If false, require any.
}

export function CanAccess({
  children,
  roles,
  permissions,
  fallback,
  requireAll = false,
}: CanAccessProps) {
  const rbac = useRbac()

  let hasAccess = true

  // Check roles
  if (roles && roles.length > 0) {
    if (requireAll) {
      hasAccess = roles.every((role) => rbac.hasRole(role))
    } else {
      hasAccess = roles.some((role) => rbac.hasRole(role))
    }
  }

  // Check permissions
  if (hasAccess && permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = permissions.every((perm) => rbac.hasPermission(perm))
    } else {
      hasAccess = permissions.some((perm) => rbac.hasPermission(perm))
    }
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
