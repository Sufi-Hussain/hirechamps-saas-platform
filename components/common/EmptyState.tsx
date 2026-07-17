import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('', className)}>
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {icon && <div className="mb-4 text-4xl opacity-50">{icon}</div>}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        {action && (
          <Button onClick={action.onClick} variant={action.variant || 'default'}>
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  )
}
