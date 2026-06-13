import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export function usePermissionGuard(requiredPermission?: string, requiredRole?: string | string[]) {
  const router = useRouter()
  const { isAuthenticated, hasPermission, hasRole, dashboardRoute } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/access-denied')
      return
    }

    if (requiredRole) {
      if (Array.isArray(requiredRole)) {
        if (!requiredRole.some((role) => hasRole(role))) {
          router.push('/access-denied')
        }
      } else {
        if (!hasRole(requiredRole)) {
          router.push('/access-denied')
        }
      }
    }
  }, [isAuthenticated, requiredPermission, requiredRole, router, hasPermission, hasRole, dashboardRoute])

  return { isAuthenticated }
}
