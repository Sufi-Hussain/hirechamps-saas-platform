import React from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  duration?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

interface Toast {
  id: string
  type: ToastType
  message: string
  duration: number
  position: string
}

let toasts: Toast[] = []
let listeners: Set<(toasts: Toast[]) => void> = new Set()

export function subscribe(listener: (toasts: Toast[]) => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notify(toasts: Toast[]) {
  listeners.forEach((listener) => listener(toasts))
}

function createToast(type: ToastType, message: string, options: ToastOptions = {}) {
  const id = Math.random().toString(36).substring(2, 11)
  const duration = options.duration ?? 4000
  const position = options.position ?? 'bottom-right'

  const toast: Toast = { id, type, message, duration, position }
  
  toasts = [...toasts, toast]
  notify(toasts)

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    notify(toasts)
  }, duration)

  return id
}

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    createToast('success', message, options),
  error: (message: string, options?: ToastOptions) =>
    createToast('error', message, options),
  info: (message: string, options?: ToastOptions) =>
    createToast('info', message, options),
  warning: (message: string, options?: ToastOptions) =>
    createToast('warning', message, options),
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id)
    notify(toasts)
  },
  dismissAll: () => {
    toasts = []
    notify(toasts)
  },
}

export function useToasts() {
  const [toastList, setToastList] = React.useState<Toast[]>([])

  React.useEffect(() => {
    return subscribe(setToastList)
  }, [])

  return toastList
}
