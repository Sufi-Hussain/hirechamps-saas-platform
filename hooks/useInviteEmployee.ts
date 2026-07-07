import { useState, useCallback } from 'react'
import api from '@/lib/api'
import { toast } from '@/lib/toast'
import { InviteEmployeeRequest, InviteEmployeeResponse, ApiErrorResponse } from '@/types/invite'

interface UseInviteEmployeeReturn {
  isLoading: boolean
  error: string | null
  success: boolean
  invite: (data: InviteEmployeeRequest) => Promise<InviteEmployeeResponse | null>
  reset: () => void
}

export function useInviteEmployee(): UseInviteEmployeeReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const invite = useCallback(async (data: InviteEmployeeRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await api.post<InviteEmployeeResponse>('/accounts/invite-employee/', {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || '',
        designation: data.designation,
        department: data.department || '',
        date_of_joining: data.date_of_joining,
      })

      setSuccess(true)
      toast.success(`Employee invited successfully! Invitation sent to ${data.email}`)
      return response.data
    } catch (err: any) {
      const errorData: ApiErrorResponse = err.response?.data || {}
      const errorMessage =
        errorData.detail || errorData.error || err.message || 'Failed to send invitation'

      setError(errorMessage)
      toast.error(errorMessage)
      console.error('[useInviteEmployee] Error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setSuccess(false)
  }, [])

  return {
    isLoading,
    error,
    success,
    invite,
    reset,
  }
}
