import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-red-600 mb-4">403</div>
          <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            You do not have permission to access this resource.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <p className="text-gray-600 mb-4">
            Contact your administrator if you believe you should have access to this page.
          </p>
          <ul className="text-sm text-gray-600 text-left space-y-2">
            <li>• Check that you have the required role</li>
            <li>• Verify your permissions are up to date</li>
            <li>• Contact your HR department for assistance</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/auth/logout">
            <Button variant="outline">
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
