import React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  variant?: 'card' | 'skeleton' | 'spinner'
  count?: number
  className?: string
}

export function LoadingState({ variant = 'card', count = 3, className }: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
      ))}
    </div>
  )
}
