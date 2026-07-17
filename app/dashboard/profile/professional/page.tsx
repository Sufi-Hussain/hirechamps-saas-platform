'use client'

import { useAuthStore } from '@/lib/store'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function ProfessionalInfoPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Professional Information</h1>
          <p className="text-muted-foreground">Manage your work-related details</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Work Details</CardTitle>
          <CardDescription>Update your professional information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Employee ID & Designation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Employee ID</label>
                <input
                  type="text"
                  placeholder="EMP-001"
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Designation</label>
                <input
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Department & Manager */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Department</label>
                <select className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Select Department</option>
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>Marketing</option>
                  <option>HR</option>
                  <option>Finance</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Manager Name</label>
                <input
                  type="text"
                  placeholder="Your manager's name"
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Joining Date & Contract Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Joining Date</label>
                <input
                  type="date"
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contract Type</label>
                <select className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Select Type</option>
                  <option>Permanent</option>
                  <option>Contract</option>
                  <option>Temporary</option>
                </select>
              </div>
            </div>

            {/* Employment Status & Office Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Employment Status</label>
                <select className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Select Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>On Leave</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Office Location</label>
                <input
                  type="text"
                  placeholder="e.g., Delhi, India"
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
