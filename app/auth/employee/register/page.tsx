'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserCheck, ArrowLeft, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Organization {
  id: string
  name: string
  slug: string
}

export default function EmployeeRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [organizationsLoading, setOrganizationsLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [organizations, setOrganizations] = useState<Organization[]>([])

  const [formData, setFormData] = useState({
    organization_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
    employee_id: '',
    department: '',
  })

  // Fetch organizations on mount
  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/organizations/', {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch organizations')
      }

      const data = await response.json()
      setOrganizations(data.results || data || [])
    } catch (err) {
      console.error('Error fetching organizations:', err)
      setError('Failed to load organizations. Please try again.')
    } finally {
      setOrganizationsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep = () => {
    setError('')
    if (step === 1) {
      if (!formData.organization_id) {
        setError('Please select an organization')
        return false
      }
    } else if (step === 2) {
      if (!formData.first_name || !formData.last_name || !formData.email) {
        setError('Please fill in all personal information')
        return false
      }
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email')
        return false
      }
    } else if (step === 3) {
      if (!formData.password || !formData.password_confirm) {
        setError('Please enter and confirm your password')
        return false
      }
      if (formData.password !== formData.password_confirm) {
        setError('Passwords do not match')
        return false
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1)
    }
  }

  const handleRegister = async () => {
    if (!validateStep()) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'employee',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || data.error || 'Registration failed')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/employee/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/auth/register-entity" className="absolute top-4 left-4 flex items-center gap-2 text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    s <= step ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-600' : 'bg-gray-300'}`}></div>}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Organization</span>
            <span>Personal Info</span>
            <span>Password</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-green-500">
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Registration successful!</p>
                <p className="text-sm">Redirecting to login...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-green-600" />
                  Select Your Company
                </h2>
                <p className="text-gray-600 mt-2">Which company do you work for?</p>
              </div>

              {organizationsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <p className="text-gray-600 mt-2">Loading organizations...</p>
                </div>
              ) : organizations.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  <p className="font-medium">No organizations found</p>
                  <p className="text-sm mt-1">Ask your company owner to create an organization first.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {organizations.map((org) => (
                    <label
                      key={org.id}
                      className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                      style={{
                        borderColor: formData.organization_id === org.id ? '#16a34a' : '#e2e8f0',
                        backgroundColor: formData.organization_id === org.id ? '#f0fdf4' : '#ffffff',
                      }}
                    >
                      <input
                        type="radio"
                        name="organization_id"
                        value={org.id}
                        checked={formData.organization_id === org.id}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-green-600"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-gray-900">{org.name}</p>
                        <p className="text-sm text-gray-500">{org.slug}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <Button
                onClick={handleNext}
                disabled={organizationsLoading || !formData.organization_id}
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <p className="text-gray-600 mt-2">Tell us about yourself</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID (Optional)</label>
                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="EMP001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department (Optional)</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Engineering"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Set Your Password</h2>
                <p className="text-gray-600 mt-2">Create a strong password for your account</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleRegister} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/auth/employee/login" className="text-green-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
