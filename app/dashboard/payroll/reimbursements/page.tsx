'use client'

import { useReimbursements } from '@/hooks/usePayroll'
import { format } from 'date-fns'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

export default function ReimbursementsPage() {
  const { reimbursements, isLoading, error, approveReimbursement, rejectReimbursement } =
    useReimbursements()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      submitted: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paid: 'bg-blue-100 text-blue-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    const result = await approveReimbursement(id)
    if (result.success) {
      // Toast will be handled by hook
    }
    setProcessingId(null)
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    const result = await rejectReimbursement(id)
    if (result.success) {
      // Toast will be handled by hook
    }
    setProcessingId(null)
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <AlertCircle className="h-5 w-5" />
        <p>Failed to load reimbursements</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reimbursements</h2>
        <Link href="/dashboard/payroll">
          <Button>Back</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    Loading reimbursements...
                  </td>
                </tr>
              ) : reimbursements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    No reimbursements found
                  </td>
                </tr>
              ) : (
                reimbursements.map((reimb) => (
                  <tr key={reimb.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{reimb.employee_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {reimb.category.charAt(0).toUpperCase() + reimb.category.slice(1)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₹{reimb.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(reimb.submitted_date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reimb.status)}`}>
                        {reimb.status.charAt(0).toUpperCase() + reimb.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {reimb.status === 'submitted' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApprove(reimb.id)}
                            disabled={processingId === reimb.id}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReject(reimb.id)}
                            disabled={processingId === reimb.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
