'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Search, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export default function EmployeesPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(searchParams.get('action') === 'add')
  const [newEmployee, setNewEmployee] = useState({
    employee_id: '',
    user: { email: '', first_name: '', last_name: '' },
    department: '',
    designation: '',
    employment_type: 'full_time',
    date_of_joining: '',
  })

  const employeesUrl = `/employees/?page=${page}&search=${searchTerm}&status=${statusFilter}`
  const { data: employees, mutate, isLoading, error } = useSWR(employeesUrl, fetcher)
  const { data: departments } = useSWR('/departments/', fetcher)
  const { data: designations } = useSWR('/designations/', fetcher)

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/employees/', newEmployee)
      setShowModal(false)
      setNewEmployee({
        employee_id: '',
        user: { email: '', first_name: '', last_name: '' },
        department: '',
        designation: '',
        employment_type: 'full_time',
        date_of_joining: '',
      })
      mutate()
    } catch (error) {
      console.error('Failed to add employee:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your workforce</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="suspended">Suspended</option>
          <option value="terminated">Terminated</option>
        </select>

        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          More Filters
        </button>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600">Loading employees...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">Failed to load employees</div>
        ) : employees?.results && employees.results.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Designation</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joining Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees.results.map((employee: any) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{employee.employee_id}</td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{employee.user_name}</p>
                          <p className="text-gray-600">{employee.user_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{employee.department_name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{employee.designation_name || '—'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            employee.employment_status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {employee.employment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{employee.date_of_joining}</td>
                      <td className="px-6 py-4 text-sm">
                        <a href={`/dashboard/employees/${employee.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {employees.results.length} of {employees.count} employees
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={!employees.previous}
                  onClick={() => setPage(page - 1)}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-600">Page {page}</span>
                <button
                  disabled={!employees.next}
                  onClick={() => setPage(page + 1)}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-600">No employees found. Add your first employee to get started.</div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Employee</h2>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={newEmployee.employee_id}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, employee_id: e.target.value })
                  }
                  placeholder="EMP001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={newEmployee.user.first_name}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        user: { ...newEmployee.user, first_name: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newEmployee.user.last_name}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        user: { ...newEmployee.user, last_name: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newEmployee.user.email}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      user: { ...newEmployee.user, email: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                <input
                  type="date"
                  value={newEmployee.date_of_joining}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, date_of_joining: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
