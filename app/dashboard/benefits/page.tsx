'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Shield, Briefcase, Pill } from 'lucide-react'

const benefits = [
  {
    id: '1',
    name: 'Health Insurance',
    description: 'Comprehensive health coverage for you and your family',
    icon: Heart,
    status: 'Active',
    details: 'Family coverage up to ₹5 Lakh',
  },
  {
    id: '2',
    name: 'Life Insurance',
    description: 'Term life insurance coverage',
    icon: Shield,
    status: 'Active',
    details: '₹50 Lakh coverage',
  },
  {
    id: '3',
    name: 'Retirement Plan',
    description: 'Provident Fund and Pension',
    icon: Briefcase,
    status: 'Active',
    details: 'Employer contribution: 12%',
  },
  {
    id: '4',
    name: 'Wellness Program',
    description: 'Annual health checkups and fitness benefits',
    icon: Pill,
    status: 'Active',
    details: 'Gym membership included',
  },
]

export default function BenefitsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Benefits & Wellness</h1>
        <p className="text-muted-foreground mt-2">Explore your benefits package and wellness programs</p>
      </div>

      {/* Benefits Grid */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <Card key={benefit.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Icon className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <CardTitle className="text-lg">{benefit.name}</CardTitle>
                        <CardDescription>{benefit.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="success">{benefit.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-foreground">{benefit.details}</p>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Enrollment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Status</CardTitle>
          <CardDescription>Manage your benefit enrollments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Health Insurance Enrollment</p>
                <p className="text-sm text-muted-foreground">Family coverage</p>
              </div>
              <Badge variant="success">Enrolled</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Wellness Program</p>
                <p className="text-sm text-muted-foreground">Annual checkup</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
