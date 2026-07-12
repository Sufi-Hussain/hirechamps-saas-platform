'use client'

import { useAuthStore } from '@/lib/store'
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface AttendanceRecord {
  date: string
  status: 'present' | 'absent' | 'half_day' | 'leave'
  check_in?: string
  check_out?: string
}

export default function AttendancePage() {
  const { user } = useAuthStore()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState({ present: 0, absent: 0, leaves: 0, total: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/employees/attendance/', {
        params: { month: new Date().toISOString().slice(0, 7) },
      })
      setRecords(response.data.records || [])
      setStats(response.data.stats || {})
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'half_day':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'leave':
        return <Calendar className="h-5 w-5 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase()
  }

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600 mt-1">View your monthly attendance records</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 font-medium">Present</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{stats.present}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 font-medium">Absent</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{stats.absent}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 font-medium">Leaves</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{stats.leaves}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 font-medium">Total Days</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600">Loading attendance records...</div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No attendance records available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check In</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check Out</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.date} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className="text-sm text-gray-900">{getStatusLabel(record.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.check_in || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.check_out || '-'}</td>
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
