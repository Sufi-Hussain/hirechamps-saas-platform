'use client'

import { Timeline, TimelineItem } from '@/components/common/Timeline'
import { FileText, CheckCircle, BookOpen, Trophy } from 'lucide-react'

interface RecentActivityProps {
  items?: TimelineItem[]
}

export function RecentActivity({ items = [] }: RecentActivityProps) {
  const defaultItems: TimelineItem[] = [
    {
      id: '1',
      title: 'Leave Application Approved',
      description: 'Your leave for Dec 15-17 has been approved',
      timestamp: '2 hours ago',
      badge: { label: 'Approved', variant: 'success' },
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      id: '2',
      title: 'Performance Review Completed',
      description: 'Your Q4 performance review has been submitted',
      timestamp: '1 day ago',
      badge: { label: 'Completed', variant: 'default' },
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      id: '3',
      title: 'New Course Enrolled',
      description: 'You have enrolled in "Advanced React Patterns"',
      timestamp: '3 days ago',
      badge: { label: 'In Progress', variant: 'info' },
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: '4',
      title: 'Document Uploaded',
      description: 'Your employment contract has been uploaded',
      timestamp: '5 days ago',
      badge: { label: 'Verified', variant: 'success' },
      icon: <FileText className="h-4 w-4" />,
    },
  ]

  const displayItems = items.length > 0 ? items : defaultItems

  return <Timeline items={displayItems} className="h-full" />
}
