'use client'

import { useState } from 'react'
import useSWR from 'swr'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalTrigger, ModalClose } from '@/components/ui/modal'
import { LeaveBalanceCards } from '@/components/leave/LeaveBalanceCards'
import { LeaveTable } from '@/components/leave/LeaveTable'
import { Plus, Check, X } from 'lucide-react'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export default function LeaveAndAttendancePage() {
  const [activeTab, setActiveTab] = useState('requests')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
  })

  const { data: leaveRequests, mutate: mutateRequests, isLoading: isLoadingRequests } = useSWR(
    '/leave-requests/?ordering=-start_date',
    fetcher
  )
  const { data: leaveTypes } = useSWR('/leave-types/', fetcher)
  const { data: leaveBalance } = useSWR('/leave-balances/my_balance/', fetcher)
  const { data: attendance } = useSWR('/attendance/?ordering=-date&limit=30', fetcher)

  const handleSubmitLeaveRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/leave-requests/', {
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        number_of_days: Math.ceil(
          (new Date(formData.end_date).getTime() - new Date(formData.start_date).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        reason: formData.reason,
      })
      setShowModal(false)
      setFormData({ leave_type: '', start_date: '', end_date: '', reason: '' })
      mutateRequests()
    } catch (error) {
      console.error('Failed to submit leave request:', error)
    }
  }

  const handleApproveLeave = async (id: string) => {
    try {
      await api.post(`/leave-requests/${id}/approve/`)
      mutateRequests()
    } catch (error) {
      console.error('Failed to approve leave:', error)
    }
  }

  const handleRejectLeave = async (id: string) => {
    try {
      await api.post(`/leave-requests/${id}/reject/`, { reason: 'Rejected' })
      mutateRequests()
    } catch (error) {
      console.error('Failed to reject leave:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground mt-2">Manage your leave applications and balance</p>
        </div>
        <Modal open={showModal} onOpenChange={setShowModal}>
          <ModalTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Apply for Leave
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Apply for Leave</ModalTitle>
              <ModalDescription>Fill in the details to apply for leave</ModalDescription>
            </ModalHeader>
            <div className="space-y-4 p-4">
              <div>
                <label className="text-sm font-medium">Leave Type</label>
                <select 
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes?.map((type: any) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">From Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">To Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Reason</label>
                <textarea
                  placeholder="Enter reason for leave"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <ModalClose asChild>
                  <Button variant="outline">Cancel</Button>
                </ModalClose>
                <Button onClick={handleSubmitLeaveRequest}>Submit Application</Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>

      {/* Leave Balance Cards */}
      {activeTab === 'balance' && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Leave Balance</h2>
          {leaveBalance && (
            <LeaveBalanceCards
              leaveTypes={leaveBalance.map((balance: any) => ({
                id: balance.id,
                name: balance.leave_type_name,
                available: balance.balance,
                used: balance.used,
                total: balance.balance + balance.used,
                color: 'bg-blue-600',
              }))}
            />
          )}
        </section>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'requests'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Leave History
        </button>
        <button
          onClick={() => setActiveTab('balance')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'balance'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Leave Balance
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'attendance'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Attendance
        </button>
      </div>

      {/* Content */}
      {activeTab === 'requests' && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Leave History</h2>
          {leaveRequests?.results && leaveRequests.results.length > 0 ? (
            <LeaveTable
              data={leaveRequests.results.map((request: any) => ({
                id: request.id,
                type: request.leave_type_name,
                fromDate: request.start_date,
                toDate: request.end_date,
                days: request.number_of_days,
                reason: request.reason,
                status: request.status.charAt(0).toUpperCase() + request.status.slice(1),
                appliedDate: request.created_at,
              }))}
              isLoading={isLoadingRequests}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No leave requests found.
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {attendance?.results && attendance.results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Check-in</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Check-out</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendance.results.map((record: any) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">{record.date}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.status === 'present'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">{record.check_in_time || '—'}</td>
                      <td className="px-6 py-3">{record.check_out_time || '—'}</td>
                      <td className="px-6 py-3">{record.hours_worked || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600">No attendance records found.</div>
          )}
        </div>
      )}

      {/* Leave Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Leave</h2>

            <form onSubmit={handleSubmitLeaveRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes?.map((type: any) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Request Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
