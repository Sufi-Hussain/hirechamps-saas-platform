'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { navigationConfig, NavItem, NavSection } from '@/lib/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  userRole?: string
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['Main'])

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon
    const active = isActive(item.href)

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
          active
            ? 'bg-primary text-primary-foreground font-medium'
            : 'text-foreground hover:bg-muted'
        }`}
        title={item.description}
      >
        {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
        <span className="flex-1 truncate">{item.title}</span>
        {item.badge && (
          <span className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  const renderSection = (section: NavSection) => {
    const isExpanded = expandedSections.includes(section.title)
    const visibleItems = section.items.filter(
      (item) => !item.roles || !userRole || item.roles.includes(userRole)
    )

    if (visibleItems.length === 0) return null

    return (
      <div key={section.title} className="space-y-1">
        <button
          onClick={() => toggleSection(section.title)}
          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <span>{section.title}</span>
          <ChevronDown
            className={`h-4 w-4 transition ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {isExpanded && (
          <div className="space-y-1 pl-2">
            {visibleItems.map(renderNavItem)}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile Toggle */}
      <div className="sticky top-0 z-40 md:hidden flex items-center justify-between p-4 bg-background border-b">
        <h1 className="font-bold text-lg">HireChamps</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-16 md:top-0 left-0 h-screen md:h-[calc(100vh-64px)] w-64 bg-background border-r overflow-y-auto transition-transform md:translate-x-0 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-2">
          {navigationConfig.map(renderSection)}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
