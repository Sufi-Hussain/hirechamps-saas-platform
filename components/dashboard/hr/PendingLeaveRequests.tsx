'use client'

import useSWR from 'swr'
import api from '@/lib/api'
import { format } from 'date-fns'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

interface LeaveRequest {
  id: string
  employee: {
    user: {
      first_name: string
      last_name: string
    }
  }
  leave_type: string
  start_date: string
  end_date: string
  status: 'pending'
  reason?: string
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-100 rounded animate-pulse">
          <div className="flex-1 h-4 bg-gray-200 rounded"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  )
}

export default function PendingLeaveRequests() {
  const { data: leaveRequests, isLoading, error, mutate } = useSWR(
    '/leave/requests/?status=pending&limit=5',
    fetcher
  )
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    try {
      await api.patch(`/leave/requests/${id}/`, { status: 'approved' })
      mutate()
    } catch (err) {
      console.error('Failed to approve:', err)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    try {
      await api.patch(`/leave/requests/${id}/`, { status: 'rejected' })
      mutate()
    } catch (err) {
      console.error('Failed to reject:', err)
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Leave Requests</h2>
        <TableSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Leave Requests</h2>
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>Failed to load leave requests. Please try again.</p>
        </div>
      </div>
    )
  }

  const data = Array.isArray(leaveRequests) ? leaveRequests : leaveRequests?.results || []

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Leave Requests</h2>
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <p className="text-gray-500">No pending leave requests</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Pending Leave Requests (Top 5)</h2>
      </div>

      <div className="space-y-4 p-6">
        {data.map((request: LeaveRequest) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {request.employee.user.first_name} {request.employee.user.last_name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {request.leave_type} • {format(new Date(request.start_date), 'MMM dd')} -{' '}
                {format(new Date(request.end_date), 'MMM dd, yyyy')}
              </p>
              {request.reason && (
                <p className="text-sm text-gray-500 mt-1">Reason: {request.reason}</p>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={() => handleApprove(request.id)}
                disabled={processingId === request.id}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleReject(request.id)}
                disabled={processingId === request.id}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
