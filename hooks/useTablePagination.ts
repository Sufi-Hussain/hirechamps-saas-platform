import { useState, useMemo } from 'react'

interface UsePaginationProps<T> {
  items: T[]
  pageSize: number
}

export function useTablePagination<T>({ items, pageSize }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)

  const pagination = useMemo(() => {
    const totalItems = items.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentItems = items.slice(startIndex, endIndex)

    return {
      currentPage,
      totalPages,
      totalItems,
      pageSize,
      currentItems,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      goToPage: (page: number) => {
        const pageNum = Math.max(1, Math.min(page, totalPages))
        setCurrentPage(pageNum)
      },
      nextPage: () => {
        setCurrentPage((p) => Math.min(p + 1, totalPages))
      },
      prevPage: () => {
        setCurrentPage((p) => Math.max(p - 1, 1))
      },
      reset: () => setCurrentPage(1),
    }
  }, [items, pageSize, currentPage])

  return pagination
}
