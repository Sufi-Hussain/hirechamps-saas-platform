interface WelcomeHeaderProps {
  userName: string
  organizationName: string
  currentDate: string
}

export default function WelcomeHeader({
  userName,
  organizationName,
  currentDate,
}: WelcomeHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}!</h1>
        <p className="text-blue-100 mb-4">{organizationName} HR Management Dashboard</p>
        <p className="text-blue-200 text-sm">{currentDate}</p>
      </div>
    </div>
  )
}
