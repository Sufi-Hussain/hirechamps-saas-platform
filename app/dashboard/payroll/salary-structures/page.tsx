'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SalaryStructuresPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Salary Structures</h2>
        <Link href="/dashboard/payroll">
          <Button>Back</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">Salary structures management coming soon</p>
      </div>
    </div>
  )
}
