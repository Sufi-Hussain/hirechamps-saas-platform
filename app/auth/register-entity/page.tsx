'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Building2, Users, Shield, ArrowLeft, Info } from 'lucide-react'

export default function RegisterEntityPage() {
  const router = useRouter()

  const entities = [
    {
      id: 'company-owner',
      name: 'Company Owner',
      title: 'Start as Organization Owner',
      description: 'Create your organization and invite your team',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      features: [
        'Create organization',
        'Set company details',
        'Invite employees',
        'Full admin control',
      ],
    },
    {
      id: 'hr-manager',
      name: 'HR Manager',
      title: 'Register as HR Manager',
      description: 'Join an existing organization as HR Manager',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      features: [
        'Select your organization',
        'Manage employees',
        'Handle leave & attendance',
        'Generate reports',
      ],
    },
    {
      id: 'employee',
      name: 'Employee',
      title: 'Register as Employee',
      description: 'Join your company as a regular employee',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      features: [
        'Select your organization',
        'Self-service features',
        'Submit leave requests',
        'View payroll',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/auth" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" />
              Back to Auth
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">HireChamps</h1>
            <div className="w-24" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Create Your Account</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose how you want to get started with HireChamps and register your account
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-12 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Different registration flows for different roles</p>
            <p className="mt-1">
              Company Owners create a new organization, while HR Managers and Employees join existing ones. Choose your role to get started.
            </p>
          </div>
        </div>

        {/* Entity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {entities.map((entity) => {
            const Icon = entity.icon
            return (
              <div
                key={entity.id}
                className={`relative overflow-hidden rounded-2xl ${entity.bgColor} border-2 ${entity.borderColor} transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                {/* Background gradient accent */}
                <div
                  className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${entity.color} opacity-10 rounded-full -mr-20 -mt-20`}
                />

                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${entity.color} p-3 mb-6`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{entity.name}</h3>
                  <p className="text-slate-600 mb-6">{entity.description}</p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {entity.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className={`w-5 h-5 rounded-full ${entity.textColor} bg-current/20 flex items-center justify-center mt-0.5 flex-shrink-0`}>
                          <svg
                            className="w-3 h-3 text-current"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <Button
                    onClick={() => router.push(`/auth/${entity.id}/register`)}
                    className={`w-full bg-gradient-to-r ${entity.color} hover:shadow-lg text-white font-semibold py-3 rounded-lg transition-all duration-300`}
                  >
                    Register as {entity.name}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-slate-200">
          <p className="text-slate-600">
            Already have an account?{' '}
            <Link href="/auth" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
