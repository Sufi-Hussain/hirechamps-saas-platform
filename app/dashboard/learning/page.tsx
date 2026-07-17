'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/common/ProgressBar'
import { BookOpen, Award, Play, CheckCircle } from 'lucide-react'

const courses = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    instructor: 'John Smith',
    progress: 75,
    status: 'In Progress',
    duration: '12 hours',
    icon: BookOpen,
  },
  {
    id: '2',
    title: 'TypeScript Fundamentals',
    instructor: 'Jane Doe',
    progress: 100,
    status: 'Completed',
    duration: '8 hours',
    icon: CheckCircle,
  },
  {
    id: '3',
    title: 'System Design Masterclass',
    instructor: 'Mike Johnson',
    progress: 0,
    status: 'Not Started',
    duration: '20 hours',
    icon: BookOpen,
  },
]

export default function LearningPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Learning & Development</h1>
        <p className="text-muted-foreground mt-2">Explore courses, certifications, and improve your skills</p>
      </div>

      {/* Learning Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Learning Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Courses in Progress</h3>
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">Continue learning</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Completed Courses</h3>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Keep up the good work</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Certifications</h3>
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-3xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">Earned this year</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Courses List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        <div className="space-y-4">
          {courses.map((course) => {
            const Icon = course.icon
            return (
              <Card key={course.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8 text-primary/50" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {course.instructor} • {course.duration}
                          </p>
                        </div>
                        <Badge
                          variant={
                            course.status === 'Completed'
                              ? 'success'
                              : course.status === 'In Progress'
                                ? 'info'
                                : 'outline'
                          }
                        >
                          {course.status}
                        </Badge>
                      </div>
                      <ProgressBar value={course.progress} max={100} showPercentage className="mb-4" />
                      <Button variant="outline" size="sm">
                        {course.status === 'Completed' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            View Certificate
                          </>
                        ) : course.status === 'In Progress' ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Continue
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Course
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Navigation */}
      <section>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="default">My Courses</Button>
          <Button variant="outline">Browse Courses</Button>
          <Button variant="outline">Certifications</Button>
          <Button variant="outline">Learning Paths</Button>
        </div>
      </section>
    </div>
  )
}
