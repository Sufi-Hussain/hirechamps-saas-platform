'use client'

import React, { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface Column<T> {
  id: string
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  className?: string
  headerClassName?: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  pagination?: boolean
  pageSize?: number
  onRowClick?: (row: T) => void
  className?: string
  emptyMessage?: string
  isLoading?: boolean
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  pagination = true,
  pageSize = 10,
  onRowClick,
  className,
  emptyMessage = 'No data available',
  isLoading = false,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    const sorted = [...data].sort((a, b) => {
      const column = columns.find((c) => c.id === sortConfig.key)
      if (!column) return 0

      const aValue =
        typeof column.accessor === 'function' ? column.accessor(a) : a[column.accessor]
      const bValue =
        typeof column.accessor === 'function' ? column.accessor(b) : b[column.accessor]

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [data, sortConfig, columns])

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize, pagination])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (columnId: string) => {
    setSortConfig((prev) => {
      if (prev?.key === columnId) {
        return { key: columnId, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key: columnId, direction: 'asc' }
    })
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="p-6 text-center text-muted-foreground">Loading...</div>
      </Card>
    )
  }

  if (!paginatedData.length) {
    return (
      <Card className={className}>
        <div className="p-6 text-center text-muted-foreground">{emptyMessage}</div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={column.headerClassName}
                  onClick={() => column.sortable && handleSort(column.id)}
                  style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortConfig?.key === column.id && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => {
                  const value =
                    typeof column.accessor === 'function' ? column.accessor(row) : row[column.accessor]
                  const cellContent = column.render ? column.render(value, row) : value

                  return (
                    <TableCell key={column.id} className={column.className}>
                      {cellContent}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
