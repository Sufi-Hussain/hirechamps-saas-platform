'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/common/MetricCard'
import { Badge } from '@/components/ui/badge'
import { SalarySlipViewer } from '@/components/payroll/SalarySlipViewer'
import { DollarSign, TrendingUp, FileText, Calendar } from 'lucide-react'

export default function PayrollPage() {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' })
  const currentYear = new Date().getFullYear()

  const sampleEarnings = {
    category: 'Earnings',
    items: [
      { label: 'Basic Salary', amount: 50000 },
      { label: 'HRA', amount: 15000 },
      { label: 'DA', amount: 10000 },
      { label: 'Bonus', amount: 5000 },
    ],
  }

  const sampleDeductions = {
    category: 'Deductions',
    items: [
      { label: 'Income Tax', amount: 8000 },
      { label: 'Provident Fund', amount: 5000 },
      { label: 'Professional Tax', amount: 500 },
      { label: 'Health Insurance', amount: 2000 },
    ],
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Payroll Management</h1>
        <p className="text-muted-foreground mt-2">View and download your salary slips and tax documents</p>
      </div>

      {/* Quick Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<DollarSign className="h-6 w-6" />}
            label="CTC Annual"
            value="₹9,80,000"
            description="Cost to Company"
          />
          <MetricCard
            icon={<TrendingUp className="h-6 w-6" />}
            label="Net Salary"
            value="₹64,500"
            description="Monthly take-home"
            trend={{ direction: 'up', value: 2 }}
          />
          <MetricCard
            icon={<FileText className="h-6 w-6" />}
            label="YTD Gross"
            value="₹4,35,000"
            description="Year to date"
          />
          <MetricCard
            icon={<Calendar className="h-6 w-6" />}
            label="YTD Tax"
            value="₹58,000"
            description="Tax paid"
          />
        </div>
      </section>

      {/* Current Month Salary */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Current Month Salary</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <Badge variant="success">Processed</Badge>
            <p className="text-sm text-muted-foreground mt-1">Salary for {currentMonth} {currentYear}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">View Slip</Button>
            <Button>Download PDF</Button>
          </div>
        </div>
      </section>

      {/* Salary Slip Preview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Salary Slip - {currentMonth} {currentYear}</h2>
        <SalarySlipViewer
          month={currentMonth}
          year={currentYear.toString()}
          employeeName="John Doe"
          designation="Senior Software Engineer"
          employeeId="EMP-001"
          earnings={sampleEarnings}
          deductions={sampleDeductions}
          grossSalary={80000}
          totalDeductions={15500}
          netSalary={64500}
        />
      </section>

      {/* Navigation Tabs */}
      <section>
        <h2 className="text-xl font-semibold mb-4">More Options</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="default">Current Month</Button>
          <Button variant="outline">Salary History</Button>
          <Button variant="outline">Tax Information</Button>
          <Button variant="outline">Salary Breakdown</Button>
        </div>
      </section>

      {/* Salary History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Salary Slips</CardTitle>
          <CardDescription>Last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-semibold">Month</th>
                  <th className="text-left py-2 px-4 font-semibold">Gross Salary</th>
                  <th className="text-left py-2 px-4 font-semibold">Deductions</th>
                  <th className="text-left py-2 px-4 font-semibold">Net Salary</th>
                  <th className="text-left py-2 px-4 font-semibold">Status</th>
                  <th className="text-left py-2 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {['July', 'June', 'May', 'April', 'March', 'February'].map((month, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{month} 2024</td>
                    <td className="py-3 px-4">₹80,000</td>
                    <td className="py-3 px-4">₹15,500</td>
                    <td className="py-3 px-4">₹64,500</td>
                    <td className="py-3 px-4">
                      <Badge variant="success">Paid</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Download</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
