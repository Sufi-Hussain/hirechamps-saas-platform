export enum Role {
  SUPER_ADMIN = 'super_admin',
  COMPANY_OWNER = 'company_owner',
  HR_MANAGER = 'hr_manager',
  EMPLOYEE = 'employee',
}

export enum Permission {
  // Dashboard
  VIEW_DASHBOARD = 'view_dashboard',

  // Profile
  VIEW_OWN_PROFILE = 'view_own_profile',
  EDIT_OWN_PROFILE = 'edit_own_profile',
  VIEW_ALL_PROFILES = 'view_all_profiles',
  EDIT_ALL_PROFILES = 'edit_all_profiles',

  // Attendance
  VIEW_OWN_ATTENDANCE = 'view_own_attendance',
  CHECK_IN_OUT = 'check_in_out',
  VIEW_ALL_ATTENDANCE = 'view_all_attendance',

  // Leave
  APPLY_LEAVE = 'apply_leave',
  VIEW_OWN_LEAVES = 'view_own_leaves',
  APPROVE_LEAVES = 'approve_leaves',
  VIEW_ALL_LEAVES = 'view_all_leaves',

  // Payroll
  VIEW_OWN_PAYSLIPS = 'view_own_payslips',
  VIEW_ALL_PAYSLIPS = 'view_all_payslips',
  MANAGE_PAYROLL = 'manage_payroll',

  // Performance
  VIEW_OWN_PERFORMANCE = 'view_own_performance',
  VIEW_ALL_PERFORMANCE = 'view_all_performance',
  MANAGE_PERFORMANCE = 'manage_performance',

  // Learning
  ENROLL_COURSES = 'enroll_courses',
  VIEW_COURSES = 'view_courses',
  MANAGE_LEARNING = 'manage_learning',

  // Administration
  MANAGE_COMPANY = 'manage_company',
  MANAGE_EMPLOYEES = 'manage_employees',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_SETTINGS = 'manage_settings',
}

// Role-based permission mapping
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission),
  [Role.COMPANY_OWNER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
    Permission.VIEW_ALL_PROFILES,
    Permission.EDIT_ALL_PROFILES,
    Permission.VIEW_ALL_ATTENDANCE,
    Permission.VIEW_ALL_LEAVES,
    Permission.APPROVE_LEAVES,
    Permission.VIEW_ALL_PAYSLIPS,
    Permission.MANAGE_PAYROLL,
    Permission.VIEW_ALL_PERFORMANCE,
    Permission.MANAGE_PERFORMANCE,
    Permission.MANAGE_LEARNING,
    Permission.MANAGE_COMPANY,
    Permission.MANAGE_EMPLOYEES,
    Permission.MANAGE_ROLES,
    Permission.MANAGE_SETTINGS,
  ],
  [Role.HR_MANAGER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
    Permission.VIEW_ALL_PROFILES,
    Permission.VIEW_ALL_ATTENDANCE,
    Permission.VIEW_ALL_LEAVES,
    Permission.APPROVE_LEAVES,
    Permission.VIEW_ALL_PAYSLIPS,
    Permission.VIEW_ALL_PERFORMANCE,
    Permission.MANAGE_PERFORMANCE,
    Permission.MANAGE_LEARNING,
    Permission.MANAGE_EMPLOYEES,
  ],
  [Role.EMPLOYEE]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
    Permission.VIEW_OWN_ATTENDANCE,
    Permission.CHECK_IN_OUT,
    Permission.APPLY_LEAVE,
    Permission.VIEW_OWN_LEAVES,
    Permission.VIEW_OWN_PAYSLIPS,
    Permission.VIEW_OWN_PERFORMANCE,
    Permission.ENROLL_COURSES,
    Permission.VIEW_COURSES,
  ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((perm) => hasPermission(role, perm))
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((perm) => hasPermission(role, perm))
}
