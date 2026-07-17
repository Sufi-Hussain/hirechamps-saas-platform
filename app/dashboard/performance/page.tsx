'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MetricCard } from '@/components/common/MetricCard'
import { ProgressBar } from '@/components/common/ProgressBar'
import { Target, TrendingUp, CheckCircle, Award } from 'lucide-react'

const goals = [
  {
    id: '1',
    title: 'Complete React Advanced Course',
    progress: 75,
    status: 'In Progress',
    dueDate: '2024-08-30',
  },
  {
    id: '2',
    title: 'Improve Code Quality Metrics',
    progress: 60,
    status: 'In Progress',
    dueDate: '2024-09-15',
  },
  {
    id: '3',
    title: 'Lead Team Project',
    progress: 100,
    status: 'Completed',
    dueDate: '2024-07-31',
  },
]

export default function PerformancePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Performance Management</h1>
        <p className="text-muted-foreground mt-2">Track your goals, reviews, and performance metrics</p>
      </div>

      {/* Quick Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Target className="h-6 w-6" />}
            label="Active Goals"
            value="2"
            description="In progress"
          />
          <MetricCard
            icon={<CheckCircle className="h-6 w-6" />}
            label="Completed Goals"
            value="3"
            description="This quarter"
          />
          <MetricCard
            icon={<TrendingUp className="h-6 w-6" />}
            label="Performance Score"
            value="4.5/5"
            description="Last review"
            trend={{ direction: 'up', value: 5 }}
          />
          <MetricCard
            icon={<Award className="h-6 w-6" />}
            label="Achievements"
            value="12"
            description="Total earned"
          />
        </div>
      </section>

      {/* Current Goals */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Goals</h2>
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">Due: {goal.dueDate}</p>
                  </div>
                  <Badge
                    variant={goal.status === 'Completed' ? 'success' : 'info'}
                  >
                    {goal.status}
                  </Badge>
                </div>
                <ProgressBar value={goal.progress} max={100} showPercentage />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <section>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="default">Goals</Button>
          <Button variant="outline">Reviews</Button>
          <Button variant="outline">KPIs</Button>
          <Button variant="outline">Career Path</Button>
        </div>
      </section>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Performance Reviews</CardTitle>
          <CardDescription>Last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Q2 2024 Performance Review</p>
                <Badge variant="success">Completed</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Rating: 4.5/5 - Excellent Performance</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Q1 2024 Performance Review</p>
                <Badge variant="success">Completed</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Rating: 4.2/5 - Good Performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
