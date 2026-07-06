'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react'

interface InviteData {
  user_email: string
  user_name: string
  organization: string
  expires_at: string
}

export default function InvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Verify invite token on load
  useEffect(() => {
    const verifyInvite = async () => {
      if (!token) {
        setError('No invite token provided')
        setVerifying(false)
        return
      }

      try {
        const response = await fetch(`http://localhost:8000/api/auth/verify-invite/?token=${token}`)
        
        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Invalid or expired invite')
          setVerifying(false)
          return
        }

        const data = await response.json()
        setInviteData(data)
        setError('')
      } catch (err: any) {
        setError('Failed to verify invite: ' + (err.message || 'Unknown error'))
      } finally {
        setVerifying(false)
      }
    }

    verifyInvite()
  }, [token])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !token) return

    setSubmitting(true)
    try {
      const response = await fetch('http://localhost:8000/api/auth/set-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password,
          confirm_password: confirmPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || data.detail || 'Failed to set password')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/employee/login')
      }, 3000)
    } catch (err: any) {
      setError('Error setting password: ' + (err.message || 'Unknown error'))
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Verifying your invite...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h1 className="text-xl font-bold text-slate-900">Invalid Invite</h1>
          </div>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/auth')} className="w-full">
            Back to Auth
          </Button>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Password Set Successfully!</h1>
          <p className="text-slate-600 mb-6">Redirecting to login...</p>
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
        </div>
      </div>
    )
  }

  // Main form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Registration</h1>
        <p className="text-slate-600 mb-6">Set your password to activate your account</p>

        {inviteData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-700">
              <strong>Email:</strong> {inviteData.user_email}
            </p>
            <p className="text-sm text-slate-700">
              <strong>Name:</strong> {inviteData.user_name}
            </p>
            <p className="text-sm text-slate-700">
              <strong>Organization:</strong> {inviteData.organization}
            </p>
          </div>
        )}

        <form onSubmit={handleSetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (validationErrors.password) {
                    setValidationErrors({ ...validationErrors, password: '' })
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                  validationErrors.password ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter password (min 8 characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (validationErrors.confirmPassword) {
                    setValidationErrors({ ...validationErrors, confirmPassword: '' })
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                  validationErrors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Setting Password...
              </>
            ) : (
              'Set Password'
            )}
          </Button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-6">
          Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and symbols.
        </p>
      </div>
    </div>
  )
}
