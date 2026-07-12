/**
 * RBAC (Role-Based Access Control) Utilities
 * Provides permission checking, role validation, and permission enforcement
 */

export enum Permission {
  // Admin Permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_ORGANIZATIONS = 'manage_organizations',

  // HR Permissions
  MANAGE_PAYROLL = 'manage_payroll',
  APPROVE_LEAVE = 'approve_leave',
  MANAGE_ATTENDANCE = 'manage_attendance',
  VIEW_EMPLOYEE_RECORDS = 'view_employee_records',
  MANAGE_EMPLOYEES = 'manage_employees',
  MANAGE_DEPARTMENTS = 'manage_departments',

  // Manager Permissions
  MANAGE_TEAM = 'manage_team',
  APPROVE_TEAM_LEAVE = 'approve_team_leave',
  VIEW_TEAM_ATTENDANCE = 'view_team_attendance',
  VIEW_TEAM_PAYSLIPS = 'view_team_payslips',

  // Employee Permissions
  VIEW_OWN_PROFILE = 'view_own_profile',
  EDIT_OWN_PROFILE = 'edit_own_profile',
  VIEW_OWN_PAYSLIPS = 'view_own_payslips',
  VIEW_OWN_ATTENDANCE = 'view_own_attendance',
  REQUEST_LEAVE = 'request_leave',
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  PLATFORM_ADMIN = 'platform_admin',
  ORG_ADMIN = 'org_admin',
  HR_MANAGER = 'hr_manager',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

/**
 * Role to Permissions Mapping
 * Defines which permissions each role has
 */
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    // Super admin has all permissions
    ...Object.values(Permission),
  ],
  [Role.PLATFORM_ADMIN]: [
    Permission.MANAGE_ORGANIZATIONS,
    Permission.MANAGE_USERS,
    Permission.VIEW_AUDIT_LOGS,
  ],
  [Role.ORG_ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.MANAGE_PAYROLL,
    Permission.MANAGE_EMPLOYEES,
    Permission.MANAGE_DEPARTMENTS,
    Permission.VIEW_AUDIT_LOGS,
  ],
  [Role.HR_MANAGER]: [
    Permission.MANAGE_PAYROLL,
    Permission.APPROVE_LEAVE,
    Permission.MANAGE_ATTENDANCE,
    Permission.VIEW_EMPLOYEE_RECORDS,
    Permission.MANAGE_EMPLOYEES,
  ],
  [Role.MANAGER]: [
    Permission.MANAGE_TEAM,
    Permission.APPROVE_TEAM_LEAVE,
    Permission.VIEW_TEAM_ATTENDANCE,
    Permission.VIEW_TEAM_PAYSLIPS,
    Permission.VIEW_OWN_PROFILE,
    Permission.VIEW_OWN_PAYSLIPS,
    Permission.VIEW_OWN_ATTENDANCE,
  ],
  [Role.EMPLOYEE]: [
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
    Permission.VIEW_OWN_PAYSLIPS,
    Permission.VIEW_OWN_ATTENDANCE,
    Permission.REQUEST_LEAVE,
  ],
}

/**
 * Backend Permission Checker
 * Validates if a role has a specific permission
 */
export class RBACPermissionChecker {
  private userRoles: Role[] = []
  private userPermissions: Permission[] = []

  constructor(roles: Role[], permissions?: Permission[]) {
    this.userRoles = roles
    // If permissions not provided, compute them from roles
    this.userPermissions = permissions || this.computePermissionsFromRoles(roles)
  }

  /**
   * Compute permissions from roles
   * Merges permissions from all user roles
   */
  private computePermissionsFromRoles(roles: Role[]): Permission[] {
    const permissions = new Set<Permission>()
    roles.forEach((role) => {
      const rolePerms = rolePermissions[role] || []
      rolePerms.forEach((perm) => permissions.add(perm))
    })
    return Array.from(permissions)
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: Permission): boolean {
    return this.userPermissions.includes(permission)
  }

  /**
   * Check if user has all specified permissions
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((perm) => this.hasPermission(perm))
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((perm) => this.hasPermission(perm))
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: Role | Role[]): boolean {
    if (Array.isArray(role)) {
      return role.some((r) => this.userRoles.includes(r))
    }
    return this.userRoles.includes(role)
  }

  /**
   * Get all user permissions
   */
  getPermissions(): Permission[] {
    return [...this.userPermissions]
  }

  /**
   * Get all user roles
   */
  getRoles(): Role[] {
    return [...this.userRoles]
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole([Role.SUPER_ADMIN, Role.PLATFORM_ADMIN, Role.ORG_ADMIN])
  }

  /**
   * Check if user can perform action on resource
   * Format: action_resource (e.g., "edit_user", "delete_department")
   */
  canAccess(action: string, resource: string): boolean {
    const permission = `${action}_${resource}` as Permission
    return this.hasPermission(permission)
  }
}

/**
 * Permission Error Class
 * Thrown when user lacks required permissions
 */
export class PermissionDeniedError extends Error {
  constructor(
    message: string = 'Permission denied',
    public readonly requiredPermissions?: Permission[],
    public readonly userPermissions?: Permission[]
  ) {
    super(message)
    this.name = 'PermissionDeniedError'
  }
}

/**
 * Backend Permission Validator
 * Validates API requests based on permissions
 */
export function validatePermission(
  userPermissions: Permission[],
  requiredPermission: Permission
): void {
  if (!userPermissions.includes(requiredPermission)) {
    throw new PermissionDeniedError(
      `Permission denied: ${requiredPermission} is required`,
      [requiredPermission],
      userPermissions
    )
  }
}

/**
 * Validate any permission (OR condition)
 */
export function validateAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): void {
  if (!requiredPermissions.some((perm) => userPermissions.includes(perm))) {
    throw new PermissionDeniedError(
      `Permission denied: One of ${requiredPermissions.join(', ')} is required`,
      requiredPermissions,
      userPermissions
    )
  }
}

/**
 * Validate all permissions (AND condition)
 */
export function validateAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): void {
  const missingPermissions = requiredPermissions.filter(
    (perm) => !userPermissions.includes(perm)
  )
  if (missingPermissions.length > 0) {
    throw new PermissionDeniedError(
      `Permission denied: ${missingPermissions.join(', ')} required`,
      requiredPermissions,
      userPermissions
    )
  }
}

/**
 * Check if user can access resource based on ownership and permissions
 */
export function canAccessResource(
  userPermissions: Permission[],
  userId: string,
  resourceOwnerId: string,
  accessPermission: Permission
): boolean {
  // Allow if user owns the resource or has the required permission
  return userId === resourceOwnerId || userPermissions.includes(accessPermission)
}

/**
 * Check if user can modify resource based on permissions
 */
export function canModifyResource(
  userPermissions: Permission[],
  userId: string,
  resourceOwnerId: string,
  modifyPermission: Permission
): boolean {
  // Only allow if user owns the resource OR has explicit modify permission
  const isOwner = userId === resourceOwnerId
  const hasPermission = userPermissions.includes(modifyPermission)
  return isOwner || hasPermission
}
