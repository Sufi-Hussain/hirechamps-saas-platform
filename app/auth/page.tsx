'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Building2, Users, User } from 'lucide-react'

export default function AuthLandingPage() {
  const entities = [
    {
      id: 'super-admin',
      title: 'Super Admin',
      description: 'Manage the entire platform, organizations, and users',
      icon: Shield,
      loginPath: '/auth/super-admin/login',
      registerPath: '/auth/super-admin/register',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      id: 'company-owner',
      title: 'Company Owner',
      description: 'Manage your organization and team members',
      icon: Building2,
      loginPath: '/auth/company-owner/login',
      registerPath: '/auth/company-owner/register',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'hr-manager',
      title: 'HR Manager',
      description: 'Manage employees, leave, and attendance',
      icon: Users,
      loginPath: '/auth/hr-manager/login',
      registerPath: null, // HR managers are invited, not self-registered
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      id: 'employee',
      title: 'Employee',
      description: 'Access your personal dashboard and records',
      icon: User,
      loginPath: '/auth/employee/login',
      registerPath: null, // Employees are invited, not self-registered
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">HireChamps</h1>
        <p className="text-xl text-slate-300 mb-2">Professional HR Management System</p>
        <p className="text-slate-400">Select your role to get started</p>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {entities.map((entity) => {
          const Icon = entity.icon
          return (
            <Card
              key={entity.id}
              className={`border-2 ${entity.borderColor} ${entity.bgColor} cursor-pointer transition-all hover:shadow-lg hover:scale-105 overflow-hidden`}
            >
              <div className={`h-1 bg-gradient-to-r ${entity.color}`}></div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-lg bg-white/10`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-slate-900">{entity.title}</CardTitle>
                <CardDescription className="text-slate-600">{entity.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={entity.loginPath} className="block">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                    Login
                  </Button>
                </Link>
                {entity.registerPath ? (
                  <Link href={entity.registerPath} className="block">
                    <Button variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-100">
                      Create Account
                    </Button>
                  </Link>
                ) : (
                  <p className="text-xs text-center text-slate-500 py-2">
                    Users are invited by administrators
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-slate-400 text-sm">
        <p>© 2024 HireChamps. All rights reserved.</p>
      </div>
    </div>
  )
}
