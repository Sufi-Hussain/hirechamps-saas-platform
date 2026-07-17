import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  showPercentage?: boolean
  className?: string
  barClassName?: string
}

export function ProgressBar({
  value,
  max = 100,
  showPercentage = false,
  className,
  barClassName,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={cn('w-full', className)}>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={cn('h-full bg-primary transition-all', barClassName)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-muted-foreground mt-1">{Math.round(percentage)}% Complete</p>
      )}
    </div>
  )
}
