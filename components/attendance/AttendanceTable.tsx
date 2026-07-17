'use client'

import { DataTable, Column } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'

export interface AttendanceRecord {
  id: string
  date: string
  checkIn: string
  checkOut: string
  workHours: string
  status: 'Present' | 'Absent' | 'Late' | 'WFH'
  isLate?: boolean
}

interface AttendanceTableProps {
  data?: AttendanceRecord[]
  isLoading?: boolean
}

export function AttendanceTable({ data = [], isLoading = false }: AttendanceTableProps) {
  const defaultData: AttendanceRecord[] = [
    {
      id: '1',
      date: '2024-07-17',
      checkIn: '09:30 AM',
      checkOut: '06:00 PM',
      workHours: '8h 30m',
      status: 'Present',
      isLate: false,
    },
    {
      id: '2',
      date: '2024-07-16',
      checkIn: '09:45 AM',
      checkOut: '05:30 PM',
      workHours: '8h 00m',
      status: 'Late',
      isLate: true,
    },
    {
      id: '3',
      date: '2024-07-15',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      workHours: '9h 00m',
      status: 'Present',
      isLate: false,
    },
    {
      id: '4',
      date: '2024-07-14',
      checkIn: '-',
      checkOut: '-',
      workHours: '0h',
      status: 'Absent',
      isLate: false,
    },
    {
      id: '5',
      date: '2024-07-13',
      checkIn: '-',
      checkOut: '-',
      workHours: '8h 00m',
      status: 'WFH',
      isLate: false,
    },
  ]

  const displayData = data.length > 0 ? data : defaultData

  const columns: Column<AttendanceRecord>[] = [
    {
      id: 'date',
      header: 'Date',
      accessor: 'date',
      sortable: true,
    },
    {
      id: 'checkIn',
      header: 'Check-in',
      accessor: 'checkIn',
    },
    {
      id: 'checkOut',
      header: 'Check-out',
      accessor: 'checkOut',
    },
    {
      id: 'workHours',
      header: 'Work Hours',
      accessor: 'workHours',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          Present: 'success',
          Absent: 'destructive',
          Late: 'warning',
          WFH: 'info',
        }
        return <Badge variant={variants[value]}>{value}</Badge>
      },
    },
  ]

  return (
    <DataTable<AttendanceRecord>
      columns={columns}
      data={displayData}
      pagination
      pageSize={10}
      isLoading={isLoading}
      emptyMessage="No attendance records found"
    />
  )
}
