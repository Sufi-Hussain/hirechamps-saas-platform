'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface TestResult {
  name: string
  status: 'pending' | 'loading' | 'success' | 'error'
  message: string
  details?: Record<string, any>
}

const TEST_ACCOUNTS = [
  {
    name: 'Super Admin',
    credential: 'super.admin@hirechamps.com',
    password: 'SuperAdmin@123',
    expectedRole: 'platform_admin',
    expectedDashboard: '/dashboard/platform-admin',
  },
  {
    name: 'Company Owner',
    credential: 'owner@acmecorp.com',
    password: 'CompanyOwner@123',
    expectedRole: 'company_owner',
    expectedDashboard: '/dashboard/owner',
  },
  {
    name: 'HR Manager',
    credential: 'hr@acmecorp.com',
    password: 'HRManager@123',
    expectedRole: 'hr_manager',
    expectedDashboard: '/dashboard/hr',
  },
  {
    name: 'Employee',
    credential: 'john.doe@acmecorp.com',
    password: 'Employee@123',
    expectedRole: 'employee',
    expectedDashboard: '/dashboard',
  },
]

export default function TestLoginPage() {
  const router = useRouter()
  const { logout } = useAuthStore()
  const [results, setResults] = useState<TestResult[]>(
    TEST_ACCOUNTS.map((account) => ({
      name: account.name,
      status: 'pending',
      message: 'Waiting to test...',
    }))
  )
  const [isRunning, setIsRunning] = useState(false)
  const [allTestsComplete, setAllTestsComplete] = useState(false)

  const runAllTests = async () => {
    setIsRunning(true)
    setAllTestsComplete(false)
    const newResults: TestResult[] = []

    for (let i = 0; i < TEST_ACCOUNTS.length; i++) {
      const account = TEST_ACCOUNTS[i]
      
      // Update result to loading
      setResults((prev) => {
        const updated = [...prev]
        updated[i] = { ...updated[i], status: 'loading', message: 'Testing login...' }
        return updated
      })

      try {
        // Test login
        const loginResponse = await fetch('http://localhost:8000/api/auth/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: account.credential,
            password: account.password,
          }),
        })

        if (!loginResponse.ok) {
          const error = await loginResponse.json().catch(() => ({}))
          throw new Error(error.detail || 'Login failed')
        }

        const data = await loginResponse.json()

        // Verify response structure
        const checks = {
          hasAccessToken: !!data.access_token,
          hasRefreshToken: !!data.refresh_token,
          hasUser: !!data.user,
          hasPermissions: Array.isArray(data.permissions),
          hasRoles: Array.isArray(data.roles),
          hasDashboardRoute: !!data.dashboard_route,
          hasOrganization: !!data.organization,
          correctRole: data.roles && data.roles.includes(account.expectedRole),
          correctDashboard: data.dashboard_route === account.expectedDashboard,
          canManageUsers: typeof data.can_manage_users === 'boolean',
          canManagePayroll: typeof data.can_manage_payroll === 'boolean',
          canApproveLeaves: typeof data.can_approve_leaves === 'boolean',
          canViewAuditLogs: typeof data.can_view_audit_logs === 'boolean',
        }

        const allChecksPassed = Object.values(checks).every((v) => v === true)

        setResults((prev) => {
          const updated = [...prev]
          updated[i] = {
            name: account.name,
            status: allChecksPassed ? 'success' : 'error',
            message: allChecksPassed
              ? 'Login successful with all expected data'
              : `Some checks failed: ${Object.entries(checks)
                  .filter(([_, v]) => !v)
                  .map(([k]) => k)
                  .join(', ')}`,
            details: {
              ...data.user,
              roles: data.roles,
              permissions: data.permissions.slice(0, 5),
              hasToken: !!data.access_token,
              dashboardRoute: data.dashboard_route,
              capabilities: {
                canManageUsers: data.can_manage_users,
                canManagePayroll: data.can_manage_payroll,
                canApproveLeaves: data.can_approve_leaves,
                canViewAuditLogs: data.can_view_audit_logs,
              },
            },
          }
          return updated
        })
      } catch (error: any) {
        setResults((prev) => {
          const updated = [...prev]
          updated[i] = {
            name: account.name,
            status: 'error',
            message: error.message || 'Login test failed',
          }
          return updated
        })
      }
    }

    setIsRunning(false)
    setAllTestsComplete(true)
  }

  const handleClearAuth = () => {
    logout()
    localStorage.removeItem('auth-store')
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Authentication Testing</h1>
          <p className="text-lg text-slate-600">Test all entity login flows and role-based access</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition h-12 flex items-center justify-center"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run All Tests'
            )}
          </Button>
          <Button
            onClick={handleClearAuth}
            variant="outline"
            className="border-slate-300 text-slate-900 hover:bg-slate-100 font-medium py-3 rounded-lg transition h-12"
          >
            Clear Auth
          </Button>
          <Button
            onClick={() => router.push('/auth')}
            variant="outline"
            className="border-slate-300 text-slate-900 hover:bg-slate-100 font-medium py-3 rounded-lg transition h-12"
          >
            Go to Login
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="border-slate-300 text-slate-900 hover:bg-slate-100 font-medium py-3 rounded-lg transition h-12"
          >
            Go to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border-2 transition ${
                result.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : result.status === 'error'
                  ? 'bg-red-50 border-red-200'
                  : result.status === 'loading'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {result.status === 'loading' && (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin flex-shrink-0 mt-0.5" />
                )}
                {result.status === 'success' && (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                )}
                {result.status === 'error' && (
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                {result.status === 'pending' && (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900">{result.name}</h3>
                  <p
                    className={`text-sm mt-1 ${
                      result.status === 'success'
                        ? 'text-green-700'
                        : result.status === 'error'
                        ? 'text-red-700'
                        : 'text-slate-600'
                    }`}
                  >
                    {result.message}
                  </p>
                </div>
              </div>

              {result.details && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200 text-xs space-y-2 max-h-64 overflow-y-auto">
                  <div>
                    <span className="font-semibold text-slate-700">Email:</span>
                    <span className="text-slate-600 ml-2">{result.details.email}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Name:</span>
                    <span className="text-slate-600 ml-2">
                      {result.details.first_name} {result.details.last_name}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Roles:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.details.roles?.map((role: string) => (
                        <span
                          key={role}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Permissions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.details.permissions?.map((perm: string) => (
                        <span
                          key={perm}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full"
                        >
                          {perm}
                        </span>
                      ))}
                      {result.details.permissions?.length > 5 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full">
                          +{result.details.permissions.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Dashboard Route:</span>
                    <span className="text-slate-600 ml-2">{result.details.dashboardRoute}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Capabilities:</span>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs">
                      {Object.entries(result.details.capabilities || {}).map(([key, value]) => (
                        <span
                          key={key}
                          className={`px-2 py-1 rounded ${
                            value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {key}: {value ? 'Yes' : 'No'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">JWT Token:</span>
                    <span className="text-slate-600 ml-2 break-all">
                      {result.details.hasToken ? 'Generated ✓' : 'Missing ✗'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {allTestsComplete && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-3">Testing Complete</h3>
            <p className="text-slate-700">
              All entity logins have been tested. Check the results above for details on each role's access and permissions.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => router.push('/auth')}
                variant="outline"
                className="border-blue-400 text-blue-700 hover:bg-blue-100"
              >
                Go to Auth Landing
              </Button>
              <Button
                onClick={() => router.push('/auth/super-admin/login')}
                variant="outline"
                className="border-red-400 text-red-700 hover:bg-red-100"
              >
                Super Admin Login
              </Button>
              <Button
                onClick={() => router.push('/auth/company-owner/login')}
                variant="outline"
                className="border-blue-400 text-blue-700 hover:bg-blue-100"
              >
                Company Owner Login
              </Button>
              <Button
                onClick={() => router.push('/auth/hr-manager/login')}
                variant="outline"
                className="border-purple-400 text-purple-700 hover:bg-purple-100"
              >
                HR Manager Login
              </Button>
              <Button
                onClick={() => router.push('/auth/employee/login')}
                variant="outline"
                className="border-green-400 text-green-700 hover:bg-green-100"
              >
                Employee Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
