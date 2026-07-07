'use client'

import React from 'react'
import { InviteEmployeeForm } from '@/components/InviteEmployeeForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function InviteEmployeePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/hr/employees"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Employees
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Invite New Employee</h1>
          <p className="text-gray-600 mt-2">
            Send an invitation to a new employee to join your organization
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl">
          <InviteEmployeeForm />
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m0 0h6"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Send Invitation</h3>
            </div>
            <p className="text-sm text-gray-600">
              Fill in the employee details and an invitation email will be sent to them.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Employee Accepts</h3>
            </div>
            <p className="text-sm text-gray-600">
              Employee receives email with a secure link to set their password.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Ready to Go</h3>
            </div>
            <p className="text-sm text-gray-600">
              Employee can immediately log in and start using the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
