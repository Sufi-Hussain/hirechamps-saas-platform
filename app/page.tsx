'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store'

export default function Page() {
  const { isAuthenticated } = useAuthStore()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 px-6 py-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 blur-lg opacity-30"></div>
          <div className="relative rounded-lg bg-white p-4">
            <svg
              className="h-16 w-16 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900">HireChamps</h1>
        <p className="text-lg text-gray-600">
          Enterprise HR Management Platform
        </p>
        <p className="max-w-md text-gray-500">
          Complete solution for HR, Payroll, Recruitment, Learning & Analytics
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {!isAuthenticated ? (
          <>
            <Link href="/auth/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline">
                Create Account
              </Button>
            </Link>
          </>
        ) : (
          <Link href="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Go to Dashboard
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            icon: '👥',
            title: 'HR Management',
            desc: 'Employee records, org structure & more',
          },
          {
            icon: '💰',
            title: 'Payroll',
            desc: 'Salary, tax, deductions & slips',
          },
          {
            icon: '🎯',
            title: 'Recruitment',
            desc: 'ATS, job postings & candidates',
          },
          {
            icon: '📚',
            title: 'Learning',
            desc: 'Training programs & enrollments',
          },
          {
            icon: '📊',
            title: 'Analytics',
            desc: 'Reports, dashboards & insights',
          },
          {
            icon: '🔐',
            title: 'Multi-Tenant',
            desc: 'Secure isolation & scalability',
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{feature.icon}</div>
            <h3 className="font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <p className="text-sm text-gray-500">
          Powered by Django & Next.js 16 • PostgreSQL • Built for Scale
        </p>
      </div>
    </main>
  )
}
