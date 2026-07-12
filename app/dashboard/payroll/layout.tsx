import Link from 'next/link'

export const metadata = {
  title: 'Payroll Management',
  description: 'Manage employee salaries, payslips, and payroll processing',
}

export default function PayrollLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tabs = [
    { name: 'Dashboard', href: '/dashboard/payroll' },
    { name: 'Salary Structures', href: '/dashboard/payroll/salary-structures' },
    { name: 'Payroll Cycles', href: '/dashboard/payroll/payroll-cycles' },
    { name: 'Payslips', href: '/dashboard/payroll/payslips' },
    { name: 'Reimbursements', href: '/dashboard/payroll/reimbursements' },
    { name: 'Loans', href: '/dashboard/payroll/loans' },
    { name: 'Reports', href: '/dashboard/payroll/reports' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
        <p className="mt-2 text-gray-600">Manage salaries, payslips, and payroll processing</p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="px-1 py-4 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 whitespace-nowrap"
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>

      {children}
    </div>
  )
}
