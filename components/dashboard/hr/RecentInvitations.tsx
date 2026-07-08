'use client'

import { format } from 'date-fns'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useDashboardHR, RecentInvite } from '@/hooks/useDashboardHR'

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-100 rounded animate-pulse">
          <div className="flex-1 h-4 bg-gray-200 rounded"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  )
}

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  accepted: 'bg-green-50 text-green-700 border border-green-200',
  expired: 'bg-red-50 text-red-700 border border-red-200',
}

export default function RecentInvitations() {
  const { dashboard, isLoading, error } = useDashboardHR()
  const invitations = dashboard?.recent_invites || []

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Invitations</h2>
        <TableSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Invitations</h2>
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>Failed to load invitations. Please try again.</p>
        </div>
      </div>
    )
  }

  if (!invitations || invitations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Invitations</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No invitations sent yet.</p>
          <Link href="/dashboard/hr/invite-employee">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Send First Invitation
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent Invitations</h2>
        <Link href="/dashboard/hr/invite-employee">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
            Send Invitation
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Sent Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Expires
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invitations.map((invite: RecentInvite) => (
              <tr key={invite.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {invite.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{invite.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[invite.status as keyof typeof statusColors]
                    }`}
                  >
                    {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {format(new Date(invite.sent_date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {format(new Date(invite.expires_at), 'MMM dd, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
