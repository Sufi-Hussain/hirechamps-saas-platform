'use client'

import { useAuthStore } from '@/lib/store'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { ProfileCompletionBar } from '@/components/profile/ProfileCompletionBar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  Briefcase,
  DollarSign,
  FileText,
  Heart,
  BookOpen,
  Award,
  Edit2,
} from 'lucide-react'

const profileSections = [
  {
    id: 'personal',
    label: 'Personal Information',
    description: 'Basic personal details and contact information',
    icon: User,
    href: '/dashboard/profile/personal',
  },
  {
    id: 'professional',
    label: 'Professional Information',
    description: 'Designation, department, and work details',
    icon: Briefcase,
    href: '/dashboard/profile/professional',
  },
  {
    id: 'bank',
    label: 'Bank Details',
    description: 'Bank account and payment information',
    icon: DollarSign,
    href: '/dashboard/profile/bank',
  },
  {
    id: 'documents',
    label: 'Identity Documents',
    description: 'Aadhar, PAN, Passport, and other documents',
    icon: FileText,
    href: '/dashboard/profile/documents',
  },
  {
    id: 'medical',
    label: 'Medical Information',
    description: 'Blood group, allergies, and medical history',
    icon: Heart,
    href: '/dashboard/profile/medical',
  },
  {
    id: 'education',
    label: 'Education & Skills',
    description: 'Education, certifications, and skills',
    icon: BookOpen,
    href: '/dashboard/profile/education',
  },
  {
    id: 'experience',
    label: 'Work Experience',
    description: 'Previous work experience and achievements',
    icon: Award,
    href: '/dashboard/profile/experience',
  },
  {
    id: 'emergency',
    label: 'Emergency Contacts',
    description: 'Family members and emergency contacts',
    icon: Heart,
    href: '/dashboard/profile/emergency',
  },
]

export default function ProfileOverview() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your personal and professional information</p>
      </div>

      {/* Profile Card */}
      <ProfileCard
        firstName={user?.first_name}
        lastName={user?.last_name}
        email={user?.email}
      />

      {/* Completion Bar */}
      <ProfileCompletionBar />

      {/* Profile Sections Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Profile Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profileSections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.id} href={section.href}>
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Icon className="h-8 w-8 text-primary/50" />
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{section.label}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
