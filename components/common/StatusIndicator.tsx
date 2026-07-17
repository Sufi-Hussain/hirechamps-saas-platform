import React from 'react'
import { cn } from '@/lib/utils'

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'pending' | 'error'
  label?: string
  animated?: boolean
  className?: string
}

export function StatusIndicator({
  status,
  label,
  animated = true,
  className,
}: StatusIndicatorProps) {
  const statusColor = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    pending: 'bg-amber-500',
    error: 'bg-red-500',
  }

  const statusLabel = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    error: 'Error',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'h-2.5 w-2.5 rounded-full',
          statusColor[status],
          animated && status === 'active' && 'animate-pulse'
        )}
      />
      <span className="text-sm text-muted-foreground">
        {label || statusLabel[status]}
      </span>
    </div>
  )
}
