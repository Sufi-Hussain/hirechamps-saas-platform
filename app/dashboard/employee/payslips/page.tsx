'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'

interface Payslip {
  id: string
  month: string
  gross_salary: number
  net_salary: number
  status: 'generated' | 'sent' | 'viewed' | 'downloaded'
  created_at: string
}

export default function EmployeePayslipsPage() {
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPayslips()
  }, [])

  const fetchPayslips = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await api.get('/payroll/payslips/', {
        params: { ordering: '-created_at' },
      })
      setPayslips(response.data.results || response.data)
    } catch (err: any) {
      setError(err.message || 'Failed to load payslips')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (payslipId: string) => {
    try {
      const response = await api.get(`/payroll/payslips/${payslipId}/download/`, {
        responseType: 'blob',
      })
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `payslip-${payslipId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
    } catch (err) {
      setError('Failed to download payslip')
    }
  }

  const handleView = (payslipId: string) => {
    // Open payslip details modal or page
    window.location.href = `/dashboard/employee/payslips/${payslipId}`
  }

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payslips</h1>
        <p className="text-gray-600 mt-1">Download and view your salary slips</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Loading payslips...</p>
          </div>
        ) : payslips.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No payslips available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Month</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Gross Salary</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Net Salary</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((payslip) => (
                  <tr key={payslip.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{payslip.month}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{payslip.gross_salary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₹{payslip.net_salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {payslip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleView(payslip.id)}
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          onClick={() => handleDownload(payslip.id)}
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
