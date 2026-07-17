import {
  LayoutDashboard,
  User,
  Calendar,
  Clock,
  DollarSign,
  Heart,
  TrendingUp,
  BookOpen,
  CheckSquare,
  Users,
  Bell,
  Settings,
  BarChart3,
  FileText,
  Shield,
  LogOut,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  description?: string
  badge?: string
  roles?: string[]
  children?: NavItem[]
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const navigationConfig: NavSection[] = [
  {
    title: 'Main',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        description: 'Overview and quick statistics',
      },
    ],
  },
  {
    title: 'Employee Self-Service',
    items: [
      {
        title: 'My Profile',
        href: '/dashboard/profile',
        icon: User,
        description: 'Personal and professional information',
      },
      {
        title: 'Attendance',
        href: '/dashboard/attendance',
        icon: Clock,
        description: 'Check-in/out and attendance records',
      },
      {
        title: 'Leave Management',
        href: '/dashboard/leave',
        icon: Calendar,
        description: 'Apply for and track leave',
      },
      {
        title: 'Payroll',
        href: '/dashboard/payroll',
        icon: DollarSign,
        description: 'Salary slips and tax information',
      },
      {
        title: 'Benefits',
        href: '/dashboard/benefits',
        icon: Heart,
        description: 'Health and wellness benefits',
      },
    ],
  },
  {
    title: 'Development & Performance',
    items: [
      {
        title: 'Performance',
        href: '/dashboard/performance',
        icon: TrendingUp,
        description: 'Goals, reviews, and KPIs',
      },
      {
        title: 'Learning',
        href: '/dashboard/learning',
        icon: BookOpen,
        description: 'Courses and certifications',
      },
      {
        title: 'Tasks & Projects',
        href: '/dashboard/tasks',
        icon: CheckSquare,
        description: 'Project management board',
      },
    ],
  },
  {
    title: 'Organization',
    items: [
      {
        title: 'Directory',
        href: '/dashboard/employees',
        icon: Users,
        description: 'Find colleagues and departments',
      },
      {
        title: 'Announcements',
        href: '/dashboard/announcements',
        icon: Bell,
        description: 'Company news and updates',
      },
      {
        title: 'Requests',
        href: '/dashboard/requests',
        icon: FileText,
        description: 'Pending requests and approvals',
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        description: 'HR analytics and reports',
        roles: ['hr', 'admin'],
      },
      {
        title: 'Admin Console',
        href: '/dashboard/admin',
        icon: Shield,
        description: 'System administration',
        roles: ['admin'],
      },
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        description: 'User preferences',
      },
    ],
  },
]

export const getNavItems = (userRole?: string): NavItem[] => {
  const items: NavItem[] = []

  navigationConfig.forEach((section) => {
    section.items.forEach((item) => {
      if (!item.roles || !userRole || item.roles.includes(userRole)) {
        items.push(item)
      }
    })
  })

  return items
}
