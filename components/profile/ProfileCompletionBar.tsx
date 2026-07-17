'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/common/ProgressBar'
import { CheckCircle2, Circle } from 'lucide-react'

interface Section {
  id: string
  label: string
  completed: boolean
}

interface ProfileCompletionBarProps {
  sections?: Section[]
}

export function ProfileCompletionBar({ sections = [] }: ProfileCompletionBarProps) {
  const defaultSections: Section[] = [
    { id: 'personal', label: 'Personal Info', completed: true },
    { id: 'professional', label: 'Professional Info', completed: true },
    { id: 'bank', label: 'Bank Details', completed: false },
    { id: 'tax', label: 'Tax Info', completed: false },
    { id: 'education', label: 'Education', completed: true },
    { id: 'emergency', label: 'Emergency Contacts', completed: true },
    { id: 'skills', label: 'Skills', completed: false },
    { id: 'certifications', label: 'Certifications', completed: false },
  ]

  const displaySections = sections.length > 0 ? sections : defaultSections
  const completed = displaySections.filter((s) => s.completed).length
  const percentage = Math.round((completed / displaySections.length) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>
        <CardDescription>Complete your profile to unlock full features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <ProgressBar
          value={completed}
          max={displaySections.length}
          label="Overall Progress"
          showPercentage
          variant={percentage >= 75 ? 'success' : percentage >= 50 ? 'warning' : 'info'}
        />

        {/* Section List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          {displaySections.map((section) => (
            <div key={section.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              {section.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <span
                className={`text-sm ${section.completed ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {section.label}
              </span>
            </div>
          ))}
        </div>

        {/* Tips */}
        {percentage < 100 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Pro tip:
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Complete all sections to get better recommendations and unlock premium features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
