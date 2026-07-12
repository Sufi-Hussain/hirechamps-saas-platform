'use client'

import { useAuthStore } from '@/lib/store'
import { Save, Lock, Bell, Users, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function SettingsPage() {
  const { user, organization } = useAuthStore()
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState({
    organizationName: organization?.name || '',
    email: organization?.email || '',
    phone: organization?.phone || '',
    website: organization?.website || '',
  })

  const handleSave = async () => {
    console.log('Saving settings:', formData)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Users },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ]

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your organization and preferences</p>
      </div>

      <div className="flex gap-6">
        <div className="w-48">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization Settings</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Password</h3>
                  <p className="text-sm text-gray-600 mb-4">Change your password to keep your account secure.</p>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account.</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Active Sessions</h3>
                  <p className="text-sm text-gray-600 mb-4">View and manage your active sessions.</p>
                  <Button variant="outline">Manage Sessions</Button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Email Notifications', description: 'Receive updates via email' },
                    { name: 'Leave Approvals', description: 'Notify when leaves are approved/rejected' },
                    { name: 'Payroll Updates', description: 'Notifications about payroll processing' },
                    { name: 'System Alerts', description: 'Important system notifications' },
                  ].map((notif) => (
                    <div key={notif.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{notif.name}</p>
                        <p className="text-sm text-gray-600">{notif.description}</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing & Plan</h2>
                </div>

                <div className="border-b pb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Current Plan</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{organization?.subscription_tier}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      $99/month • Renews on December 15, 2024
                    </p>
                  </div>
                </div>

                <div className="border-b pb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Plan Features</h3>
                  <ul className="space-y-2">
                    {['Up to 50 Employees', 'Payroll Management', 'HR Module', 'Recruitment'].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline">Upgrade Plan</Button>
                  <Button variant="outline">Cancel Subscription</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
