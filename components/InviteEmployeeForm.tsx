'use client'

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useSWR from 'swr'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { inviteEmployeeSchema, InviteEmployeeFormData } from '@/lib/schemas/invite'
import { toast } from '@/lib/toast'
import { Designation, Department, ApiErrorResponse, InviteEmployeeResponse } from '@/types/invite'
import { Calendar, Loader2, AlertCircle } from 'lucide-react'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export function InviteEmployeeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InviteEmployeeFormData>({
    resolver: zodResolver(inviteEmployeeSchema),
    mode: 'onBlur',
  })

  const { data: designations, isLoading: designationsLoading } = useSWR<Designation[]>(
    '/designations/',
    fetcher
  )
  const { data: departments, isLoading: departmentsLoading } = useSWR<Department[]>(
    '/departments/',
    fetcher
  )

  const onSubmit = async (data: InviteEmployeeFormData) => {
    setIsSubmitting(true)
    setSuccessMessage('')

    try {
      const response = await api.post<InviteEmployeeResponse>(
        '/accounts/invite-employee/',
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone || '',
          designation: data.designation,
          department: data.department || '',
          date_of_joining: data.date_of_joining,
        }
      )

      setSuccessMessage(`Invitation sent successfully to ${data.email}`)
      toast.success('Employee invited successfully! Invitation email has been sent.')
      reset()

      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
    } catch (error: any) {
      const errorData: ApiErrorResponse = error.response?.data || {}
      const errorMessage =
        errorData.detail ||
        errorData.error ||
        error.message ||
        'Failed to send invitation. Please try again.'

      toast.error(errorMessage)
      console.error('[InviteEmployeeForm] Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Invite Employee</h2>

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
            <div className="text-green-600 flex-shrink-0 pt-0.5">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-sm font-medium text-green-800">{successMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="first_name"
                type="text"
                placeholder="John"
                {...register('first_name')}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.first_name
                    ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500/10 focus:border-blue-500'
                }`}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="last_name"
                type="text"
                placeholder="Doe"
                {...register('last_name')}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.last_name
                    ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500/10 focus:border-blue-500'
                }`}
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...register('email')}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500/10 focus:border-blue-500'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...register('phone')}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.phone
                  ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500/10 focus:border-blue-500'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Designation */}
            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                Designation <span className="text-red-500">*</span>
              </label>
              <select
                id="designation"
                {...register('designation')}
                disabled={designationsLoading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all appearance-none bg-white cursor-pointer ${
                  errors.designation
                    ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500/10 focus:border-blue-500'
                } ${designationsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {designationsLoading ? 'Loading...' : 'Select a designation'}
                </option>
                {designations?.map((designation) => (
                  <option key={designation.id} value={designation.id}>
                    {designation.name}
                  </option>
                ))}
              </select>
              {errors.designation && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.designation.message}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <select
                id="department"
                {...register('department')}
                disabled={departmentsLoading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all appearance-none bg-white cursor-pointer ${
                  errors.department
                    ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500/10 focus:border-blue-500'
                } ${departmentsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {departmentsLoading ? 'Loading...' : 'Select a department'}
                </option>
                {departments?.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.department.message}
                </p>
              )}
            </div>
          </div>

          {/* Date of Joining */}
          <div>
            <label htmlFor="date_of_joining" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Joining <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                id="date_of_joining"
                type="date"
                {...register('date_of_joining')}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.date_of_joining
                    ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500/10 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.date_of_joining && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.date_of_joining.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Invitation...
                </>
              ) : (
                'Send Invitation'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> An invitation email will be sent to the employee with a secure
            link to set their password and complete registration.
          </p>
        </div>
      </div>
    </div>
  )
}
