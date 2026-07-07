'use client'

import React, { useEffect, useState } from 'react'
import { subscribe } from '@/lib/toast'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration: number
  position: string
}

const toastIcons = {
  success: <CheckCircle className="h-5 w-5 text-green-600" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
  info: <Info className="h-5 w-5 text-blue-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
}

const toastBgColors = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
  warning: 'bg-yellow-50 border-yellow-200',
}

const toastTextColors = {
  success: 'text-green-800',
  error: 'text-red-800',
  info: 'text-blue-800',
  warning: 'text-yellow-800',
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return subscribe(setToasts)
  }, [])

  const groupedToasts = toasts.reduce(
    (acc, toast) => {
      if (!acc[toast.position]) {
        acc[toast.position] = []
      }
      acc[toast.position].push(toast)
      return acc
    },
    {} as Record<string, Toast[]>
  )

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`fixed z-50 flex flex-col gap-2 pointer-events-none ${
            position === 'top-left' && 'top-4 left-4'
          } ${position === 'top-right' && 'top-4 right-4'} ${
            position === 'bottom-left' && 'bottom-4 left-4'
          } ${position === 'bottom-right' && 'bottom-4 right-4'}
          `}
        >
          {positionToasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-lg border p-4 shadow-lg flex items-start gap-3 max-w-sm ${toastBgColors[toast.type]}`}
            >
              <div className="flex-shrink-0 pt-0.5">{toastIcons[toast.type]}</div>
              <div className={`flex-1 text-sm font-medium ${toastTextColors[toast.type]}`}>
                {toast.message}
              </div>
              <button
                className={`flex-shrink-0 ml-2 inline-flex text-gray-400 hover:text-gray-600 transition-colors`}
                onClick={() => {
                  const { toast: toastApi } = require('@/lib/toast')
                  toastApi.dismiss(toast.id)
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
