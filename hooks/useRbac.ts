import { useAuthStore } from '@/lib/store'

export function useRbac() {
  const store = useAuthStore()

  return {
    // Check if user has specific permission
    hasPermission: (permissionCode: string): boolean => {
      return store.hasPermission(permissionCode)
    },

    // Check if user has specific role
    hasRole: (role: string | string[]): boolean => {
      return store.hasRole(role)
    },

    // Check if user has any of the permissions
    hasAnyPermission: (permissions: string[]): boolean => {
      return store.hasAnyPermission(permissions)
    },

    // Get all user permissions
    getPermissions: (): string[] => {
      return store.permissions
    },

    // Get all user roles
    getRoles: (): string[] => {
      return store.roles
    },

    // Check if user is admin (super_admin or org_admin)
    isAdmin: (): boolean => {
      return store.hasRole(['super_admin', 'admin', 'org_admin'])
    },

    // Check if user is HR or Payroll manager
    isHrOrPayroll: (): boolean => {
      return store.hasRole(['hr', 'payroll_manager'])
    },

    // Check if user is manager
    isManager: (): boolean => {
      return store.hasRole('manager')
    },

    // Check if user is employee
    isEmployee: (): boolean => {
      return store.hasRole('employee')
    },

    // Check if user can perform action on resource
    canAccess: (action: string, resource: string): boolean => {
      const permission = `${action}_${resource}`
      return store.hasPermission(permission)
    },
  }
}
