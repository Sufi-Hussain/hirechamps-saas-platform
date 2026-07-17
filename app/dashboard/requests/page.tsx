'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalTrigger, ModalClose } from '@/components/ui/modal'
import { Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const requests = [
  {
    id: '1',
    title: 'Work from Home Request',
    description: 'Request to work from home on Friday',
    date: '2024-07-15',
    status: 'Approved',
    requestedDate: '2024-07-19',
  },
  {
    id: '2',
    title: 'Equipment Request',
    description: 'New Dell Monitor for home setup',
    date: '2024-07-10',
    status: 'Pending',
    requestedDate: '2024-07-10',
  },
  {
    id: '3',
    title: 'Policy Exception Request',
    description: 'Exception for flexible working hours',
    date: '2024-07-05',
    status: 'Rejected',
    requestedDate: '2024-07-05',
  },
]

export default function RequestsPage() {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    date: '',
  })

  const handleSubmit = () => {
    // Handle form submission
    console.log('Request submitted:', formData)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'Pending':
        return 'info'
      case 'Rejected':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4" />
      case 'Pending':
        return <Clock className="h-4 w-4" />
      case 'Rejected':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Requests & Approvals</h1>
          <p className="text-muted-foreground mt-2">Submit and track your requests</p>
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Submit New Request</ModalTitle>
              <ModalDescription>Fill in the details for your request</ModalDescription>
            </ModalHeader>
            <div className="space-y-4 p-4">
              <div>
                <label className="text-sm font-medium">Request Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Type</option>
                  <option value="wfh">Work from Home</option>
                  <option value="equipment">Equipment Request</option>
                  <option value="policy">Policy Exception</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Request title"
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide details"
                  rows={3}
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Requested Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <ModalClose asChild>
                  <Button variant="outline">Cancel</Button>
                </ModalClose>
                <Button onClick={handleSubmit}>Submit Request</Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>

      {/* Status Summary */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-3xl font-bold mt-2">1</p>
                </div>
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold mt-2">2</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-3xl font-bold mt-2">3</p>
                </div>
                <AlertCircle className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Requests List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Requests</h2>
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{request.title}</h3>
                      <Badge variant={getStatusColor(request.status) as any}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Submitted: {request.date}</span>
                      <span>Requested: {request.requestedDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
