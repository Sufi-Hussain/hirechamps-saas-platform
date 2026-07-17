'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn, LogOut, Loader } from 'lucide-react'

interface CheckInButtonProps {
  isCheckedIn?: boolean
  onCheckIn?: () => Promise<void>
  onCheckOut?: () => Promise<void>
}

export function CheckInButton({
  isCheckedIn = false,
  onCheckIn,
  onCheckOut,
}: CheckInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await onCheckIn?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckOut = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await onCheckOut?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check out')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Current Status</p>

          <div className="mb-6">
            <div
              className={`text-4xl font-bold mb-2 ${isCheckedIn ? 'text-green-600' : 'text-gray-400'}`}
            >
              {isCheckedIn ? '✓' : '○'}
            </div>
            <p className="text-lg font-semibold">
              {isCheckedIn ? 'Checked In' : 'Not Checked In'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            {!isCheckedIn ? (
              <Button
                onClick={handleCheckIn}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Checking In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Check In
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleCheckOut}
                disabled={isLoading}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Checking Out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Check Out
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
