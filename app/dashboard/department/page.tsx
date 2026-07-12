'use client'

import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DepartmentPage() {
  const departments = [
    { id: 1, name: 'Engineering', manager: 'John Smith', employees: 45, budget: '$250K', status: 'Active' },
    { id: 2, name: 'Sales', manager: 'Jane Doe', employees: 30, budget: '$180K', status: 'Active' },
    { id: 3, name: 'Human Resources', manager: 'Bob Wilson', employees: 12, budget: '$75K', status: 'Active' },
    { id: 4, name: 'Operations', manager: 'Alice Brown', employees: 28, budget: '$140K', status: 'Active' },
    { id: 5, name: 'Marketing', manager: 'Charlie Davis', employees: 15, budget: '$95K', status: 'Active' },
  ]

  return (
    <div className="space-y-6 py-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage organizational departments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Department
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Department</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Manager</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Employees</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Budget</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{dept.name}</td>
                  <td className="px-6 py-4 text-gray-600">{dept.manager}</td>
                  <td className="px-6 py-4 text-gray-900">{dept.employees}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{dept.budget}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded transition text-blue-600 hover:text-blue-700">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded transition text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
            <p className="text-sm text-gray-600 mb-4">Manager: {dept.manager}</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Team Size</span>
                <span className="font-semibold text-gray-900">{dept.employees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Annual Budget</span>
                <span className="font-semibold text-gray-900">{dept.budget}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
