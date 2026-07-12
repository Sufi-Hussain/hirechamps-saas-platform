'use client'

import { usePayslips } from '@/hooks/usePayroll'
import { format } from 'date-fns'
import { AlertCircle, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PayslipsPage() {
  const { payslips, isLoading, error } = usePayslips()

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-800',
      processed: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      released: 'bg-purple-100 text-purple-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <AlertCircle className="h-5 w-5" />
        <p>Failed to load payslips</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payslips</h2>
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Month</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Gross Salary</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Deductions</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Net Salary</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                    Loading payslips...
                  </td>
                </tr>
              ) : payslips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                    No payslips found
                  </td>
                </tr>
              ) : (
                payslips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{slip.employee_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{slip.payroll_month}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₹{slip.gross_salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ₹{slip.total_deductions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ₹{slip.net_salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(slip.status)}`}>
                        {slip.status.charAt(0).toUpperCase() + slip.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
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
