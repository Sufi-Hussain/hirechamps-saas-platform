'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Check, X } from 'lucide-react'

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

  const { data: leaveRequests, mutate: mutateRequests } = useSWR(
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave & Attendance</h1>
          <p className="text-gray-600 mt-1">Manage leave requests and track attendance</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Request Leave
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            activeTab === 'requests'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Leave Requests
        </button>
        <button
          onClick={() => setActiveTab('balance')}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            activeTab === 'balance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Leave Balance
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            activeTab === 'attendance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Attendance
        </button>
      </div>

      {/* Content */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {leaveRequests?.results && leaveRequests.results.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {leaveRequests.results.map((request: any) => (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.leave_type_name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.start_date} to {request.end_date} • {request.number_of_days} days
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Reason: {request.reason}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : request.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {request.status}
                      </span>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveLeave(request.id)}
                            className="p-2 hover:bg-green-100 text-green-600 rounded transition"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleRejectLeave(request.id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded transition"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600">No leave requests found.</div>
          )}
        </div>
      )}

      {activeTab === 'balance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leaveBalance?.map((balance: any) => (
            <div key={balance.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900">{balance.leave_type_name}</h3>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Balance</span>
                  <span className="font-semibold text-gray-900">{balance.balance} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Used</span>
                  <span className="font-semibold text-gray-900">{balance.used} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carryforward</span>
                  <span className="font-semibold text-gray-900">{balance.carryforward} days</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((balance.balance / (balance.balance + balance.used)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
