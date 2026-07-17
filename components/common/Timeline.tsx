import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface TimelineItem {
  id: string | number
  title: string
  description?: string
  timestamp?: string
  icon?: React.ReactNode
  badge?: {
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  }
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <Card className={className}>
      <div className="p-6">
        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {item.icon || (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  )}
                </div>
                {index < items.length - 1 && (
                  <div className="w-0.5 h-12 bg-border mt-2"></div>
                )}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  {item.badge && (
                    <Badge variant={item.badge.variant}>{item.badge.label}</Badge>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                )}
                {item.timestamp && (
                  <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
