'use client'

import { useAuthStore } from '@/lib/store'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader } from 'lucide-react'

export default function EmployeeProfilePage() {
  const { user, organization } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profile_image_url: user?.profile_image_url || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError('')
    try {
      // Call API to update profile
      // const response = await api.put(`/users/${user?.id}/`, formData)
      // Update success
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">View and update your personal information</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isSaving}
            variant={isEditing ? 'default' : 'outline'}
          >
            {isSaving ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Edit Profile'
            )}
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full" />
              {isEditing && (
                <input
                  type="url"
                  name="profile_image_url"
                  value={formData.profile_image_url}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              )}
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              ) : (
                <p className="text-gray-900">{formData.first_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              ) : (
                <p className="text-gray-900">{formData.last_name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email (Read-only)</label>
            <p className="text-gray-900">{formData.email}</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            ) : (
              <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
            )}
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
            <p className="text-gray-900">{organization?.name}</p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3">
          <Button onClick={() => setIsEditing(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  )
}
