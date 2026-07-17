'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bell, Star, Search } from 'lucide-react'
import { useState } from 'react'

const announcements = [
  {
    id: '1',
    title: 'Company All-Hands Meeting',
    description: 'Join us for our quarterly all-hands meeting on Friday at 2 PM',
    category: 'Meeting',
    author: 'HR',
    date: '2024-07-18',
    priority: 'High',
    pinned: true,
  },
  {
    id: '2',
    title: 'New Company Policy - Remote Work',
    description: 'We are introducing a new flexible work-from-home policy',
    category: 'Policy',
    author: 'HR',
    date: '2024-07-17',
    priority: 'High',
    pinned: false,
  },
  {
    id: '3',
    title: 'Maintenance Window - July 20',
    description: 'System maintenance scheduled for July 20, 10 PM - 12 AM',
    category: 'Maintenance',
    author: 'IT',
    date: '2024-07-16',
    priority: 'Medium',
    pinned: false,
  },
  {
    id: '4',
    title: 'Team Outing - August 5',
    description: 'Annual team outing at the beach. Register by July 25.',
    category: 'Event',
    author: 'Events',
    date: '2024-07-15',
    priority: 'Low',
    pinned: false,
  },
]

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'destructive'
      case 'Medium':
        return 'info'
      case 'Low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Meeting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      case 'Policy':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
      case 'Maintenance':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
      case 'Event':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  const filteredAnnouncements = announcements.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground mt-2">Stay updated with company announcements and news</p>
      </div>

      {/* Search */}
      <section>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </section>

      {/* Announcements List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          <Bell className="inline-block h-5 w-5 mr-2" />
          Latest Announcements
        </h2>
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`hover:shadow-md transition-shadow ${
                announcement.pinned ? 'border-primary/50 border-2' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback>{announcement.author.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        {announcement.pinned && (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                      <Badge variant={getPriorityColor(announcement.priority) as any}>
                        {announcement.priority}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-3">{announcement.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)}`}>
                          {announcement.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {announcement.author} • {announcement.date}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">Read More</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Archive */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Archive</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No archived announcements</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
