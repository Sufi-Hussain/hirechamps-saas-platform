import { useState, useCallback } from 'react'

interface UseFormModalProps<T = any> {
  onSubmit: (data: T) => Promise<void> | void
}

export function useFormModal<T>({ onSubmit }: UseFormModalProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openModal = useCallback(() => {
    setIsOpen(true)
    setError(null)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setError(null)
  }, [])

  const handleSubmit = useCallback(
    async (data: T) => {
      try {
        setIsLoading(true)
        setError(null)
        await onSubmit(data)
        closeModal()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        console.error('Form submission error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [onSubmit, closeModal]
  )

  return {
    isOpen,
    isLoading,
    error,
    openModal,
    closeModal,
    handleSubmit,
  }
}
