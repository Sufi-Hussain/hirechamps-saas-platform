'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User } from 'lucide-react'

interface ProfileCardProps {
  firstName?: string
  lastName?: string
  email?: string
  designation?: string
  department?: string
  avatar?: string
}

export function ProfileCard({
  firstName = 'John',
  lastName = 'Doe',
  email = 'john.doe@example.com',
  designation = 'Software Engineer',
  department = 'Engineering',
  avatar,
}: ProfileCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={`${firstName} ${lastName}`}
                className="h-24 w-24 rounded-lg object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {firstName} {lastName}
            </h2>
            <p className="text-muted-foreground">{email}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="default">{designation}</Badge>
              <Badge variant="secondary">{department}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
