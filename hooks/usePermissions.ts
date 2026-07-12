'use client'

import { useAuthStore } from '@/lib/store'
import {
  Permission,
  RBACPermissionChecker,
  rolePermissions,
  Role,
  validatePermission,
  validateAnyPermission,
  validateAllPermissions,
} from '@/lib/rbac'
import { useCallback } from 'react'

/**
 * Hook for permission checking in components
 * Provides both permission validation and access control utilities
 */
export function usePermissions() {
  const { roles, permissions } = useAuthStore()

  // Create permission checker instance
  const checker = new RBACPermissionChecker(
    roles as Role[],
    permissions as Permission[]
  )

  /**
   * Check if user has specific permission
   */
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      return checker.hasPermission(permission)
    },
    [checker]
  )

  /**
   * Check if user has all specified permissions
   */
  const hasAllPermissions = useCallback(
    (perms: Permission[]): boolean => {
      return checker.hasAllPermissions(perms)
    },
    [checker]
  )

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (perms: Permission[]): boolean => {
      return checker.hasAnyPermission(perms)
    },
    [checker]
  )

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback(
    (role: Role | Role[]): boolean => {
      return checker.hasRole(role)
    },
    [checker]
  )

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback((): boolean => {
    return checker.isAdmin()
  }, [checker])

  /**
   * Check if user can perform action on resource
   */
  const canAccess = useCallback(
    (action: string, resource: string): boolean => {
      return checker.canAccess(action, resource)
    },
    [checker]
  )

  /**
   * Get all user permissions
   */
  const getPermissions = useCallback((): Permission[] => {
    return checker.getPermissions()
  }, [checker])

  /**
   * Get all user roles
   */
  const getRoles = useCallback((): Role[] => {
    return checker.getRoles()
  }, [checker])

  /**
   * Assert user has permission (throws if not)
   */
  const requirePermission = useCallback(
    (permission: Permission, message?: string): void => {
      validatePermission(permissions as Permission[], permission)
    },
    [permissions]
  )

  /**
   * Assert user has all permissions (throws if not)
   */
  const requireAllPermissions = useCallback(
    (perms: Permission[], message?: string): void => {
      validateAllPermissions(permissions as Permission[], perms)
    },
    [permissions]
  )

  /**
   * Assert user has any permission (throws if not)
   */
  const requireAnyPermission = useCallback(
    (perms: Permission[], message?: string): void => {
      validateAnyPermission(permissions as Permission[], perms)
    },
    [permissions]
  )

  /**
   * Get permissions for a specific role
   */
  const getRolePermissions = useCallback(
    (role: Role): Permission[] => {
      return rolePermissions[role] || []
    },
    []
  )

  /**
   * Check if user can manage users
   */
  const canManageUsers = useCallback((): boolean => {
    return hasPermission(Permission.MANAGE_USERS)
  }, [hasPermission])

  /**
   * Check if user can manage payroll
   */
  const canManagePayroll = useCallback((): boolean => {
    return hasPermission(Permission.MANAGE_PAYROLL)
  }, [hasPermission])

  /**
   * Check if user can approve leave
   */
  const canApproveLeave = useCallback((): boolean => {
    return hasPermission(Permission.APPROVE_LEAVE)
  }, [hasPermission])

  /**
   * Check if user can view audit logs
   */
  const canViewAuditLogs = useCallback((): boolean => {
    return hasPermission(Permission.VIEW_AUDIT_LOGS)
  }, [hasPermission])

  return {
    // Permission checkers
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    isAdmin,
    canAccess,
    getPermissions,
    getRoles,
    getRolePermissions,

    // Permission assertions (throw if not authorized)
    requirePermission,
    requireAllPermissions,
    requireAnyPermission,

    // Common permission checks
    canManageUsers,
    canManagePayroll,
    canApproveLeave,
    canViewAuditLogs,

    // Direct access to checker for advanced use
    checker,
  }
}
