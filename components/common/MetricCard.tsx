import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  icon?: React.ReactNode
  label: string
  value: string | number
  description?: string
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: number
    label?: string
  }
  className?: string
}

export function MetricCard({
  icon,
  label,
  value,
  description,
  trend,
  className,
}: MetricCardProps) {
  const trendColor =
    trend?.direction === 'up'
      ? 'text-green-600 dark:text-green-400'
      : trend?.direction === 'down'
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted-foreground'

  const trendIcon =
    trend?.direction === 'up'
      ? '↑'
      : trend?.direction === 'down'
        ? '↓'
        : '→'

  return (
    <Card className={cn('', className)}>
      <CardContent className="flex flex-col gap-2 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          {icon && <div className="text-primary/50">{icon}</div>}
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <div className={cn('text-sm font-medium flex items-center gap-1 mt-2', trendColor)}>
            <span>{trendIcon}</span>
            <span>{trend.value}%</span>
            {trend.label && <span className="text-muted-foreground ml-1">{trend.label}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
