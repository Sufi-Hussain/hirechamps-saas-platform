export interface SalaryComponent {
  id: string
  name: string
  code: string
  component_type: 'earning' | 'deduction'
  calculation_method: 'percentage' | 'fixed' | 'formula'
  percentage?: number
  fixed_amount?: number
  is_active: boolean
  is_taxable: boolean
  is_statutory: boolean
}

export interface SalaryStructure {
  id: string
  designation: string
  designation_name: string
  base_salary: number
  ctc: number
  effective_from: string
  effective_to?: string
  components: SalaryStructureComponent[]
}

export interface SalaryStructureComponent {
  id: string
  component: string
  component_name: string
  component_code: string
  amount: number
}

export interface SalaryRevision {
  id: string
  employee: string
  employee_name: string
  employee_email: string
  effective_from: string
  effective_to?: string
  base_salary: number
  ctc: number
  components: Record<string, number>
  reason?: string
}

export interface BankAccount {
  id: string
  employee: string
  employee_email: string
  account_number: string
  ifsc_code: string
  bank_name: string
  branch_name: string
  account_holder_name: string
  account_type: 'savings' | 'current'
  verification_status: 'unverified' | 'pending' | 'verified'
  is_active: boolean
}

export interface PayrollCycle {
  id: string
  month: number
  year: number
  status: 'draft' | 'processing' | 'locked' | 'released' | 'archived'
  start_date: string
  end_date: string
  salary_due_date: string
  total_employees: number
  processed_employees: number
  released_by?: string
  released_by_name?: string
  released_at?: string
}

export interface Payslip {
  id: string
  payroll_cycle: string
  employee: string
  employee_name: string
  employee_email: string
  payroll_month: string
  status: 'draft' | 'processed' | 'approved' | 'released'
  base_salary: number
  earnings: Record<string, number>
  deductions: Record<string, number>
  gross_salary: number
  total_deductions: number
  net_salary: number
  tax_amount: number
  pf_contribution: number
  days_worked: number
  working_days: number
  leave_days: number
}

export interface Reimbursement {
  id: string
  employee: string
  employee_name: string
  category: 'travel' | 'meal' | 'entertainment' | 'medical' | 'other'
  amount: number
  description: string
  receipt_file?: string
  status: 'submitted' | 'approved' | 'rejected' | 'paid'
  submitted_date: string
  approved_by?: string
  approved_by_name?: string
  approved_date?: string
  approval_comments?: string
}

export interface Loan {
  id: string
  employee: string
  employee_name: string
  loan_type: 'personal' | 'home' | 'education' | 'advance'
  amount: number
  interest_rate: number
  tenure_months: number
  emi_amount: number
  status: 'applied' | 'approved' | 'rejected' | 'active' | 'closed'
  disbursement_date?: string
  approved_by?: string
  approved_by_name?: string
  remaining_amount: number
  emis?: LoanEMI[]
}

export interface LoanEMI {
  id: string
  emi_number: number
  due_date: string
  emi_amount: number
  principal: number
  interest: number
  status: 'pending' | 'paid' | 'missed'
  paid_date?: string
  paid_amount?: number
}

export interface TaxSummary {
  id: string
  employee: string
  employee_name: string
  financial_year_start: string
  financial_year_end: string
  gross_salary: number
  standard_deduction: number
  tax_deducted: number
  pf_contribution: number
  taxable_income: number
}

export interface Settlement {
  id: string
  employee: string
  employee_name: string
  exit_date: string
  gratuity_amount: number
  leave_encashment: number
  pending_salary: number
  pending_reimbursement: number
  total_payable: number
  total_deductions: number
  net_settlement: number
  processed: boolean
  processed_date?: string
}

export interface PayrollAuditLog {
  id: string
  action_type: string
  user: string
  user_name: string
  entity_type: string
  entity_id: number
  old_values: Record<string, any>
  new_values: Record<string, any>
  change_summary: string
  ip_address?: string
  created_at: string
}
