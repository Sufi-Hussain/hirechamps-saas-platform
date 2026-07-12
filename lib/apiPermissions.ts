/**
 * API Permission Middleware
 * Enforces RBAC permissions on backend API calls
 */

import { Permission, PermissionDeniedError } from './rbac'
import api from './api'

/**
 * Define which API endpoints require which permissions
 */
export const apiPermissionMap: Record<string, Permission | Permission[]> = {
  // User Management
  'GET /api/users': Permission.MANAGE_USERS,
  'POST /api/users': Permission.MANAGE_USERS,
  'PUT /api/users/:id': Permission.MANAGE_USERS,
  'DELETE /api/users/:id': Permission.MANAGE_USERS,

  // Payroll Management
  'GET /api/payroll': Permission.MANAGE_PAYROLL,
  'POST /api/payroll': Permission.MANAGE_PAYROLL,
  'PUT /api/payroll/:id': Permission.MANAGE_PAYROLL,
  'DELETE /api/payroll/:id': Permission.MANAGE_PAYROLL,
  'GET /api/payroll/cycles': Permission.MANAGE_PAYROLL,
  'POST /api/payroll/cycles': Permission.MANAGE_PAYROLL,

  // Leave Management
  'GET /api/leave': Permission.REQUEST_LEAVE,
  'POST /api/leave': Permission.REQUEST_LEAVE,
  'PUT /api/leave/:id': Permission.REQUEST_LEAVE,
  'GET /api/leave/approve': Permission.APPROVE_LEAVE,
  'POST /api/leave/approve': Permission.APPROVE_LEAVE,

  // Attendance
  'GET /api/attendance': Permission.VIEW_OWN_ATTENDANCE,
  'POST /api/attendance': Permission.MANAGE_ATTENDANCE,
  'PUT /api/attendance/:id': Permission.MANAGE_ATTENDANCE,

  // Employee Records
  'GET /api/employees': Permission.VIEW_EMPLOYEE_RECORDS,
  'POST /api/employees': Permission.MANAGE_EMPLOYEES,
  'PUT /api/employees/:id': Permission.MANAGE_EMPLOYEES,
  'GET /api/employees/:id': Permission.VIEW_EMPLOYEE_RECORDS,

  // Department Management
  'GET /api/departments': Permission.MANAGE_DEPARTMENTS,
  'POST /api/departments': Permission.MANAGE_DEPARTMENTS,
  'PUT /api/departments/:id': Permission.MANAGE_DEPARTMENTS,
  'DELETE /api/departments/:id': Permission.MANAGE_DEPARTMENTS,

  // Audit Logs
  'GET /api/audit': Permission.VIEW_AUDIT_LOGS,

  // Profile (Own)
  'GET /api/profile': Permission.VIEW_OWN_PROFILE,
  'PUT /api/profile': Permission.EDIT_OWN_PROFILE,

  // Payslips (Own)
  'GET /api/payslips': Permission.VIEW_OWN_PAYSLIPS,
  'GET /api/payslips/:id': Permission.VIEW_OWN_PAYSLIPS,
}

/**
 * Get required permission for an API endpoint
 */
export function getRequiredPermission(
  method: string,
  path: string
): Permission | Permission[] | null {
  // Try exact match first
  const key = `${method} ${path}`
  if (apiPermissionMap[key]) {
    return apiPermissionMap[key]
  }

  // Try pattern matching
  for (const [endpoint, permission] of Object.entries(apiPermissionMap)) {
    const pattern = endpoint
      .replace(/:[a-zA-Z]+/g, '[^/]+') // Replace :id with pattern
      .replace(/\//g, '\\/')
      .replace(/\./g, '\\.')

    if (new RegExp(`^${pattern}$`).test(key)) {
      return permission
    }
  }

  return null
}

/**
 * Validate API request permissions
 */
export function validateApiPermission(
  userPermissions: Permission[],
  method: string,
  path: string
): void {
  const requiredPermission = getRequiredPermission(method, path)

  if (!requiredPermission) {
    // No permission required for this endpoint
    return
  }

  if (Array.isArray(requiredPermission)) {
    // Any of the required permissions will work
    if (!requiredPermission.some((perm) => userPermissions.includes(perm))) {
      throw new PermissionDeniedError(
        `Permission denied for ${method} ${path}`,
        requiredPermission,
        userPermissions
      )
    }
  } else {
    // Specific permission required
    if (!userPermissions.includes(requiredPermission)) {
      throw new PermissionDeniedError(
        `Permission denied for ${method} ${path}`,
        [requiredPermission],
        userPermissions
      )
    }
  }
}

/**
 * Add permission interceptor to API client
 */
export function setupApiPermissionInterceptor(
  getPermissions: () => Permission[]
) {
  // Add response interceptor to handle permission errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 403 Forbidden as permission denied
      if (error.response?.status === 403) {
        throw new PermissionDeniedError(
          error.response.data?.message || 'Permission denied',
          undefined,
          getPermissions()
        )
      }
      throw error
    }
  )

  // Add request interceptor to validate permissions before making API calls
  api.interceptors.request.use(
    (config) => {
      const method = config.method?.toUpperCase() || 'GET'
      const path = new URL(config.url || '', 'http://localhost').pathname

      try {
        validateApiPermission(getPermissions(), method, path)
      } catch (error) {
        // Permission denied, reject the request
        return Promise.reject(error)
      }

      return config
    },
    (error) => Promise.reject(error)
  )
}

/**
 * Permission Check Wrapper for API Calls
 * Wraps async functions that make API calls
 */
export async function withPermissionCheck<T>(
  permissionCheck: () => Promise<void>,
  apiCall: () => Promise<T>
): Promise<T> {
  await permissionCheck()
  return apiCall()
}

/**
 * Create permission-checked API wrapper
 */
export function createPermissionCheckedApi(getPermissions: () => Permission[]) {
  return {
    /**
     * Make GET request with permission check
     */
    get: async <T = any>(url: string, config?: any): Promise<T> => {
      validateApiPermission(getPermissions(), 'GET', url)
      const response = await api.get<T>(url, config)
      return response.data
    },

    /**
     * Make POST request with permission check
     */
    post: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
      validateApiPermission(getPermissions(), 'POST', url)
      const response = await api.post<T>(url, data, config)
      return response.data
    },

    /**
     * Make PUT request with permission check
     */
    put: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
      validateApiPermission(getPermissions(), 'PUT', url)
      const response = await api.put<T>(url, data, config)
      return response.data
    },

    /**
     * Make DELETE request with permission check
     */
    delete: async <T = any>(url: string, config?: any): Promise<T> => {
      validateApiPermission(getPermissions(), 'DELETE', url)
      const response = await api.delete<T>(url, config)
      return response.data
    },

    /**
     * Make PATCH request with permission check
     */
    patch: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
      validateApiPermission(getPermissions(), 'PATCH', url)
      const response = await api.patch<T>(url, data, config)
      return response.data
    },
  }
}
