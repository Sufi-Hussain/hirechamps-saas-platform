'use client'

import { useEffect, ReactNode } from 'react'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    setUser,
    setOrganization,
    setAccessToken,
    setRefreshToken,
    setPermissions,
    setRoles,
    setDashboardRoute,
    setCapabilities,
    accessToken,
  } = useAuthStore()

  useEffect(() => {
    // Initialize auth from stored tokens on app load
    const initializeAuth = async () => {
      const storedAccessToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      const storedUser = localStorage.getItem('user')

      if (storedAccessToken) {
        setAccessToken(storedAccessToken)
        setRefreshToken(storedRefreshToken)

        // Set token in API client
        if (api.defaults.headers.common) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedAccessToken}`
        }

        // Restore user data if available
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setUser(user)
        }

        // Verify token is still valid by calling /auth/me/
        try {
          const response = await api.get('/auth/me/')
          const userData = response.data
          setUser(userData.user)
          setOrganization(userData.organization)
          setPermissions(userData.permissions || [])
          setRoles(userData.roles || [])
          setDashboardRoute(userData.dashboard_route || '/dashboard')
          setCapabilities(userData.capabilities || {})
        } catch (error: any) {
          // If 401, try to refresh token
          if (error.response?.status === 401 && storedRefreshToken) {
            try {
              const refreshResponse = await api.post('/auth/refresh/', {
                refresh_token: storedRefreshToken,
              })
              const newAccessToken = refreshResponse.data.access_token
              localStorage.setItem('accessToken', newAccessToken)
              setAccessToken(newAccessToken)

              if (api.defaults.headers.common) {
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
              }

              // Retry fetching user data with new token
              const retryResponse = await api.get('/auth/me/')
              const userData = retryResponse.data
              setUser(userData.user)
              setOrganization(userData.organization)
              setPermissions(userData.permissions || [])
              setRoles(userData.roles || [])
              setDashboardRoute(userData.dashboard_route || '/dashboard')
              setCapabilities(userData.capabilities || {})
            } catch (refreshError) {
              // Refresh failed, clear auth
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              localStorage.removeItem('user')
              setUser(null)
              setOrganization(null)
              setAccessToken(null)
              setRefreshToken(null)
            }
          } else {
            // Other error, clear auth
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            setUser(null)
            setOrganization(null)
            setAccessToken(null)
            setRefreshToken(null)
          }
        }
      }
    }

    initializeAuth()
  }, [])

  // Set API token whenever it changes
  useEffect(() => {
    if (accessToken && api.defaults.headers.common) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    }
  }, [accessToken])

  return <>{children}</>
}
