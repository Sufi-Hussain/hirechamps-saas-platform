'use client'

import { AuthProvider } from '@/components/providers/AuthProvider'
import { ReactNode } from 'react'

export function LayoutWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
