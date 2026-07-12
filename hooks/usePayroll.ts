import useSWR from 'swr'
import api from '@/lib/api'
import { useState, useCallback } from 'react'
import { Payslip, PayrollCycle, Reimbursement, Loan } from '@/types/payroll'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export function usePayslips(cycleId?: string) {
  const url = cycleId ? `/payroll/payslips/?cycle=${cycleId}` : '/payroll/payslips/'
  const { data, isLoading, error, mutate } = useSWR<Payslip[]>(url, fetcher)

  return { payslips: data || [], isLoading, error, mutate }
}

export function usePayrollCycles() {
  const { data, isLoading, error, mutate } = useSWR<PayrollCycle[]>(
    '/payroll/cycles/',
    fetcher
  )

  return { cycles: data || [], isLoading, error, mutate }
}

export function useReimbursements(status?: string) {
  const url = status ? `/payroll/reimbursements/?status=${status}` : '/payroll/reimbursements/'
  const { data, isLoading, error, mutate } = useSWR<Reimbursement[]>(url, fetcher)

  const approveReimbursement = useCallback(
    async (id: string, comments?: string) => {
      try {
        await api.patch(`/payroll/reimbursements/${id}/approve/`, {
          approval_comments: comments,
        })
        mutate()
        return { success: true }
      } catch (err: any) {
        return { success: false, error: err.response?.data?.detail || 'Failed to approve' }
      }
    },
    [mutate]
  )

  const rejectReimbursement = useCallback(
    async (id: string, reason?: string) => {
      try {
        await api.patch(`/payroll/reimbursements/${id}/reject/`, {
          approval_comments: reason,
        })
        mutate()
        return { success: true }
      } catch (err: any) {
        return { success: false, error: err.response?.data?.detail || 'Failed to reject' }
      }
    },
    [mutate]
  )

  return {
    reimbursements: data || [],
    isLoading,
    error,
    mutate,
    approveReimbursement,
    rejectReimbursement,
  }
}

export function useLoans(employeeId?: string) {
  const url = employeeId ? `/payroll/loans/?employee=${employeeId}` : '/payroll/loans/'
  const { data, isLoading, error, mutate } = useSWR<Loan[]>(url, fetcher)

  const approveLoan = useCallback(
    async (id: string, disbursementDate: string) => {
      try {
        await api.patch(`/payroll/loans/${id}/approve/`, {
          disbursement_date: disbursementDate,
        })
        mutate()
        return { success: true }
      } catch (err: any) {
        return { success: false, error: err.response?.data?.detail || 'Failed to approve' }
      }
    },
    [mutate]
  )

  return { loans: data || [], isLoading, error, mutate, approveLoan }
}

export function usePayrollStats() {
  const { data, isLoading, error } = useSWR('/payroll/stats/', fetcher)

  return {
    stats: data || {
      total_employees: 0,
      active_cycles: 0,
      monthly_payroll: 0,
      pending_approvals: 0,
    },
    isLoading,
    error,
  }
}
