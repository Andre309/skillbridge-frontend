'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'

interface NavItem {
  label: string
  href:  string
  icon:  React.ReactNode
}

interface DashboardNavProps {
  items: NavItem[]
}

export default function DashboardNav({ items }: DashboardNavProps) {
  const pathname  = usePathname()
  const clearAuth = useAuthStore(s => s.clearAuth)
  const user      = useAuthStore(s => s.user)
  const router    = useRouter()

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  const initials = user?.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) ?? 'US'

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-24 bg-white border border-sand-200 rounded-2xl overflow-hidden">

        {/* User info */}
        <div className="p-5 border-b border-sand-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center
                            justify-center text-sm font-medium flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">{user?.fullName ?? 'Користувач'}</p>
              <p className="text-xs text-stone-400 truncate">{user?.email ?? ''}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="p-2">
          {items.map(item => (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5',
                pathname === item.href
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-sand-100 hover:text-stone-900'
              )}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-sand-100 mt-1">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                       text-stone-400 hover:bg-red-50 hover:text-red-600 transition-all">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Вийти
          </button>
        </div>
      </div>
    </aside>
  )
}
