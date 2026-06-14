import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  organization: string
  organization_name?: string
  is_verified: boolean
  profile_image_url?: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  subscription_tier: 'starter' | 'professional' | 'enterprise'
  subscription_status: 'active' | 'trial' | 'suspended' | 'cancelled'
  employees_count: number
}

interface AuthStore {
  user: User | null
  organization: Organization | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  permissions: string[]
  roles: string[]
  dashboardRoute: string
  canManageUsers: boolean
  canManagePayroll: boolean
  canApproveLeaves: boolean
  canViewAuditLogs: boolean

  setUser: (user: User | null) => void
  setOrganization: (org: Organization | null) => void
  setAccessToken: (token: string | null) => void
  setRefreshToken: (token: string | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPermissions: (permissions: string[]) => void
  setRoles: (roles: string[]) => void
  setDashboardRoute: (route: string) => void
  setCapabilities: (caps: any) => void
  hasPermission: (code: string) => boolean
  hasRole: (roleType: string | string[]) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  logout: () => void
  login: (credential: string, password: string, organizationId?: string) => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      organization: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      permissions: [],
      roles: [],
      dashboardRoute: '/dashboard',
      canManageUsers: false,
      canManagePayroll: false,
      canApproveLeaves: false,
      canViewAuditLogs: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setOrganization: (organization) => set({ organization }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setPermissions: (permissions) => set({ permissions }),
      setRoles: (roles) => set({ roles }),
      setDashboardRoute: (dashboardRoute) => set({ dashboardRoute }),
      setCapabilities: (caps) =>
        set({
          canManageUsers: caps.can_manage_users || false,
          canManagePayroll: caps.can_manage_payroll || false,
          canApproveLeaves: caps.can_approve_leaves || false,
          canViewAuditLogs: caps.can_view_audit_logs || false,
        }),
      
      hasPermission: (code: string) => {
        const { permissions } = get()
        return permissions.includes(code)
      },
      
      hasRole: (roleType: string | string[]) => {
        const { roles } = get()
        if (typeof roleType === 'string') {
          return roles.includes(roleType)
        }
        return roleType.some((r) => roles.includes(r))
      },
      
      hasAnyPermission: (perms: string[]) => {
        const { permissions } = get()
        return perms.some((p) => permissions.includes(p))
      },

      logout: () => {
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
        }
        set({
          user: null,
          organization: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
          permissions: [],
          roles: [],
          dashboardRoute: '/dashboard',
          canManageUsers: false,
          canManagePayroll: false,
          canApproveLeaves: false,
          canViewAuditLogs: false,
        })
      },

      login: async (credential: string, password: string, organizationId?: string) => {
        set({ isLoading: true, error: null })
        try {
          const payload: any = {
            credential,
            password,
          }
          if (organizationId) {
            payload.organization_id = organizationId
          }

          const response = await fetch('http://localhost:8000/api/auth/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.detail || errorData.message || 'Invalid credentials')
          }

          const data = await response.json()
          
          // Store tokens
          if (data.access_token) {
            localStorage.setItem('accessToken', data.access_token)
          }
          if (data.refresh_token) {
            localStorage.setItem('refreshToken', data.refresh_token)
          }

          // Store user data
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user))
          }
          
          set({
            user: data.user,
            organization: data.organization,
            permissions: data.permissions || [],
            roles: data.roles || [],
            dashboardRoute: data.dashboard_route || '/dashboard',
            canManageUsers: data.can_manage_users || false,
            canManagePayroll: data.can_manage_payroll || false,
            canApproveLeaves: data.can_approve_leaves || false,
            canViewAuditLogs: data.can_view_audit_logs || false,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          })
          throw error
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
        roles: state.roles,
        dashboardRoute: state.dashboardRoute,
        canManageUsers: state.canManageUsers,
        canManagePayroll: state.canManagePayroll,
        canApproveLeaves: state.canApproveLeaves,
        canViewAuditLogs: state.canViewAuditLogs,
      }),
    }
  )
)

interface UIStore {
  isSidebarOpen: boolean
  activeModule: string
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
  }>

  setSidebarOpen: (open: boolean) => void
  setActiveModule: (module: string) => void
  addNotification: (
    type: 'success' | 'error' | 'info' | 'warning',
    message: string
  ) => void
  removeNotification: (id: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: true,
  activeModule: 'dashboard',
  notifications: [],

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setActiveModule: (module) => set({ activeModule: module }),
  addNotification: (type, message) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: `${Date.now()}`,
          type,
          message,
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))

interface DataStore {
  employees: any[]
  departments: any[]
  designations: any[]
  leaveTypes: any[]
  jobPostings: any[]
  candidates: any[]
  trainingPrograms: any[]

  setEmployees: (employees: any[]) => void
  setDepartments: (departments: any[]) => void
  setDesignations: (designations: any[]) => void
  setLeaveTypes: (types: any[]) => void
  setJobPostings: (postings: any[]) => void
  setCandidates: (candidates: any[]) => void
  setTrainingPrograms: (programs: any[]) => void
}

export const useDataStore = create<DataStore>((set) => ({
  employees: [],
  departments: [],
  designations: [],
  leaveTypes: [],
  jobPostings: [],
  candidates: [],
  trainingPrograms: [],

  setEmployees: (employees) => set({ employees }),
  setDepartments: (departments) => set({ departments }),
  setDesignations: (designations) => set({ designations }),
  setLeaveTypes: (types) => set({ leaveTypes: types }),
  setJobPostings: (postings) => set({ jobPostings: postings }),
  setCandidates: (candidates) => set({ candidates }),
  setTrainingPrograms: (programs) => set({ trainingPrograms: programs }),
}))
