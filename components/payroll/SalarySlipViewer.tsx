'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'

interface SalaryBreakdown {
  category: string
  items: Array<{ label: string; amount: number }>
}

interface SalarySlipProps {
  month: string
  year: string
  employeeName: string
  designation: string
  employeeId: string
  earnings: SalaryBreakdown
  deductions: SalaryBreakdown
  grossSalary: number
  totalDeductions: number
  netSalary: number
}

export function SalarySlipViewer({
  month,
  year,
  employeeName,
  designation,
  employeeId,
  earnings,
  deductions,
  grossSalary,
  totalDeductions,
  netSalary,
}: SalarySlipProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle>Salary Slip - {month} {year}</CardTitle>
            <CardDescription>Employee ID: {employeeId}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {/* Employee Info */}
        <div className="mb-8 pb-8 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Employee Name</p>
              <p className="font-semibold">{employeeName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Designation</p>
              <p className="font-semibold">{designation}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Salary Period</p>
              <p className="font-semibold">{month} {year}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Salary Date</p>
              <p className="font-semibold">31-{new Date(`${month} 1`).getMonth() + 1}-{year}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Earnings */}
          <div>
            <h3 className="font-bold text-lg mb-4">Earnings</h3>
            <div className="space-y-3">
              {earnings.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">₹ {item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 border-t flex justify-between font-semibold">
                <span>Gross Salary</span>
                <span>₹ {grossSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="font-bold text-lg mb-4">Deductions</h3>
            <div className="space-y-3">
              {deductions.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">₹ {item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 border-t flex justify-between font-semibold">
                <span>Total Deductions</span>
                <span>₹ {totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-200">Net Salary</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                ₹ {netSalary.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-green-700 dark:text-green-200 text-right">
              Amount transferred to your account
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
