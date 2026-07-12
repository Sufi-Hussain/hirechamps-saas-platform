import { NextRequest, NextResponse } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = ['/dashboard']

// Public routes that don't require authentication
const publicRoutes = ['/auth', '/access-denied', '/']

// Routes that redirect to dashboard if already authenticated
const authRoutes = ['/auth']

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

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|icon).*)'],
}
