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
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  setUser: (user: User | null) => void
  setOrganization: (org: Organization | null) => void
  setAccessToken: (token: string | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setOrganization: (organization) => set({ organization }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () =>
        set({
          user: null,
          organization: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
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
