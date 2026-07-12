import { NextRequest, NextResponse } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = ['/dashboard']

// Public routes that don't require authentication
const publicRoutes = ['/auth', '/access-denied', '/']

// Routes that redirect to dashboard if already authenticated
const authRoutes = ['/auth']

// Role-based route restrictions
// Map of pathname patterns to required roles
const roleRestrictedRoutes: Record<string, string[]> = {
  '/dashboard/platform-admin': ['super_admin', 'platform_admin'],
  '/dashboard/admin': ['super_admin', 'org_admin', 'platform_admin'],
  '/dashboard/owner': ['org_admin', 'super_admin'],
  '/dashboard/hr': ['hr_manager', 'org_admin', 'super_admin'],
  '/dashboard/payroll': ['hr_manager', 'org_admin', 'super_admin'],
  '/dashboard/employees': ['hr_manager', 'manager', 'org_admin', 'super_admin'],
}

/**
 * Check if user's role allows access to route
 */
function checkRoleAccess(pathname: string, userRoles: string[]): boolean {
  for (const [routePattern, allowedRoles] of Object.entries(
    roleRestrictedRoutes
  )) {
    if (pathname.startsWith(routePattern)) {
      return allowedRoles.some((role) => userRoles.includes(role))
    }
  }
  // If no role restrictions found for this route, allow access
  return true
}

/**
 * Parse user roles from auth token (JWT)
 * In production, you'd validate the JWT signature here
 */
function getUserRolesFromToken(accessToken: string): string[] {
  try {
    // Extract payload from JWT (format: header.payload.signature)
    const parts = accessToken.split('.')
    if (parts.length !== 3) {
      return []
    }

    // Decode payload (add padding if necessary)
    const payload = parts[1]
    const padding = 4 - (payload.length % 4)
    const paddedPayload = padding < 4 ? payload + '='.repeat(padding) : payload

    const decoded = JSON.parse(
      Buffer.from(paddedPayload, 'base64').toString('utf-8')
    )

    // Extract roles from token
    return decoded.roles || decoded.role ? [decoded.role] : []
  } catch (error) {
    // If JWT parsing fails, return empty roles
    return []
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublic = publicRoutes.some((route) => pathname === route)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If no token and trying to access protected route, redirect to login
  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If has token and trying to access auth route, redirect to dashboard
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check role-based access for protected routes
  if (isProtected && accessToken) {
    const userRoles = getUserRolesFromToken(accessToken)

    if (!checkRoleAccess(pathname, userRoles)) {
      return NextResponse.redirect(new URL('/access-denied', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|icon).*)'],
}
