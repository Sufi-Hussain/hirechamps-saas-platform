'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  content: string
  date: string
  type: 'info' | 'warning' | 'success'
  read?: boolean
}

interface AnnouncementsFeedProps {
  announcements?: Announcement[]
}

export function AnnouncementsFeed({ announcements = [] }: AnnouncementsFeedProps) {
  const defaultAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'New Learning Program Available',
      content: 'Check out our newly launched React Advanced Patterns course.',
      date: 'Today',
      type: 'info',
      read: true,
    },
    {
      id: '2',
      title: 'System Maintenance Scheduled',
      content: 'System will be under maintenance on Sunday, 12 AM - 2 AM',
      date: 'Yesterday',
      type: 'warning',
      read: false,
    },
    {
      id: '3',
      title: 'Company Outing Confirmed',
      content: 'Team outing scheduled for next Saturday at Adventure Park',
      date: '2 days ago',
      type: 'success',
      read: true,
    },
  ]

  const displayAnnouncements = announcements.length > 0 ? announcements : defaultAnnouncements

  const typeColors = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Announcements
        </CardTitle>
        <CardDescription>Latest company news and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`p-4 rounded-lg border ${typeColors[announcement.type]} ${!announcement.read ? 'ring-1 ring-primary/50' : ''}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-medium text-sm">{announcement.title}</h4>
                {!announcement.read && (
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
              <p className="text-xs text-muted-foreground">{announcement.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
