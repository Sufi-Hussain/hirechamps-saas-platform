'use client'

import { DataTable, Column } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'

export interface LeaveRequest {
  id: string
  type: string
  fromDate: string
  toDate: string
  days: number
  reason: string
  status: 'Approved' | 'Pending' | 'Rejected'
  appliedDate: string
}

interface LeaveTableProps {
  data?: LeaveRequest[]
  isLoading?: boolean
}

export function LeaveTable({ data = [], isLoading = false }: LeaveTableProps) {
  const defaultData: LeaveRequest[] = [
    {
      id: '1',
      type: 'Casual Leave',
      fromDate: '2024-07-20',
      toDate: '2024-07-22',
      days: 3,
      reason: 'Personal work',
      status: 'Approved',
      appliedDate: '2024-07-15',
    },
    {
      id: '2',
      type: 'Sick Leave',
      fromDate: '2024-07-18',
      toDate: '2024-07-18',
      days: 1,
      reason: 'Medical appointment',
      status: 'Pending',
      appliedDate: '2024-07-17',
    },
    {
      id: '3',
      type: 'Earned Leave',
      fromDate: '2024-06-15',
      toDate: '2024-06-20',
      days: 6,
      reason: 'Vacation',
      status: 'Approved',
      appliedDate: '2024-06-01',
    },
  ]

  const displayData = data.length > 0 ? data : defaultData

  const columns: Column<LeaveRequest>[] = [
    {
      id: 'type',
      header: 'Leave Type',
      accessor: 'type',
      sortable: true,
    },
    {
      id: 'fromDate',
      header: 'From Date',
      accessor: 'fromDate',
      sortable: true,
    },
    {
      id: 'toDate',
      header: 'To Date',
      accessor: 'toDate',
    },
    {
      id: 'days',
      header: 'Days',
      accessor: 'days',
    },
    {
      id: 'reason',
      header: 'Reason',
      accessor: 'reason',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          Approved: 'success',
          Pending: 'warning',
          Rejected: 'destructive',
        }
        return <Badge variant={variants[value]}>{value}</Badge>
      },
    },
  ]

  return (
    <DataTable<LeaveRequest>
      columns={columns}
      data={displayData}
      pagination
      pageSize={10}
      isLoading={isLoading}
      emptyMessage="No leave requests found"
    />
  )
}
