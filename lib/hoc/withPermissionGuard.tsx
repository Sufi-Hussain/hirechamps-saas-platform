import React from 'react'
import { hasPermission, Permission, Role } from '@/lib/permissions'

interface WithPermissionGuardOptions {
  permission: Permission
  fallback?: React.ReactNode
}

export function withPermissionGuard<P extends object>(
  Component: React.ComponentType<P & { userRole?: Role }>,
  { permission, fallback = null }: WithPermissionGuardOptions
) {
  return function GuardedComponent(
    props: P & { userRole?: Role }
  ) {
    const { userRole = Role.EMPLOYEE, ...restProps } = props

    if (!hasPermission(userRole as Role, permission)) {
      return fallback ? <>{fallback}</> : null
    }

    return <Component {...(restProps as P)} userRole={userRole as Role} />
  }
}
