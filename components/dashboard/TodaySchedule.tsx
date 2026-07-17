'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

interface ScheduleItem {
  id: string
  title: string
  time: string
  duration: string
  type: 'meeting' | 'task' | 'break'
}

interface TodayScheduleProps {
  items?: ScheduleItem[]
}

export function TodaySchedule({ items = [] }: TodayScheduleProps) {
  const defaultItems: ScheduleItem[] = [
    {
      id: '1',
      title: 'Team Standup',
      time: '10:00 AM',
      duration: '30 min',
      type: 'meeting',
    },
    {
      id: '2',
      title: 'Project Review',
      time: '2:00 PM',
      duration: '1 hour',
      type: 'meeting',
    },
    {
      id: '3',
      title: 'Task Completion',
      time: '3:30 PM',
      duration: 'Flexible',
      type: 'task',
    },
  ]

  const displayItems = items.length > 0 ? items : defaultItems

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Today&apos;s Schedule
        </CardTitle>
        <CardDescription>Upcoming events and tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-3 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.time} • {item.duration}</p>
              </div>
              <Badge
                variant={
                  item.type === 'meeting'
                    ? 'default'
                    : item.type === 'task'
                      ? 'secondary'
                      : 'outline'
                }
              >
                {item.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
