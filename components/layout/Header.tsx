'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'

const NAV = [
  { label: 'Знайти ментора', href: '/mentors' },
  { label: 'Стати ментором', href: '/become-mentor' },
  { label: 'Як це працює',  href: '/#how-it-works' },
  { label: 'Тарифи',        href: '/#pricing' },
]

function UserMenu() {
  const router    = useRouter()
  const user      = useAuthStore(s => s.user)
  const clearAuth = useAuthStore(s => s.clearAuth)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Закрити при кліку поза меню
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  const initials = user?.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'US'

  const dashboardHref =
    user?.role === 'mentor' ? '/mentor/dashboard' :
    user?.role === 'both'   ? '/mentor/dashboard' :
    '/dashboard'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 group"
      >
        {/* Avatar */}
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-stone-200 group-hover:ring-brand-300 transition-all"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 flex items-center
                          justify-center text-sm font-medium ring-2 ring-stone-200
                          group-hover:ring-brand-300 transition-all">
            {initials}
          </div>
        )}
        {/* Chevron */}
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className={cn('text-stone-400 transition-transform', open && 'rotate-180')}
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-stone-200
                        rounded-2xl shadow-xl shadow-stone-200/60 overflow-hidden z-50">

          {/* User info */}
          <div className="px-4 py-3 border-b border-stone-100">
            <p className="text-sm font-medium text-stone-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-stone-400 truncate">{user?.email}</p>
          </div>

          {/* Links */}
          <div className="p-1.5">
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-stone-600
                         hover:bg-sand-50 hover:text-stone-900 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="2" y="2" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="8.5" y="2" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="2" y="8.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="8.5" y="8.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              Мій кабінет
            </Link>

            {(user?.role === 'mentor' || user?.role === 'both') && (
              <Link
                href="/mentor/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-stone-600
                           hover:bg-sand-50 hover:text-stone-900 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M2 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Мій профіль
              </Link>
            )}

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-stone-600
                         hover:bg-sand-50 hover:text-stone-900 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7.5 2v1M7.5 12v1M2 7.5h1M12 7.5h1M3.5 3.5l.7.7M10.8 10.8l.7.7M3.5 11.5l.7-.7M10.8 4.2l.7-.7"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Налаштування
            </Link>
          </div>

          {/* Logout */}
          <div className="p-1.5 border-t border-stone-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm
                         text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M5.5 13H3a1 1 0 01-1-1V3a1 1 0 011-1h2.5M10 10l3-3-3-3M13 7H6"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Вийти
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const user = useAuthStore(s => s.user)
  const isAuth = !!user

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-sand-50/90 backdrop-blur-md border-b border-sand-200/60 py-3'
        : 'bg-transparent py-5'
    )}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7C2 4.24 4.24 2 7 2s5 2.24 5 5-2.24 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 5v4M5 7h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-medium tracking-tight">
            Skill<em className="text-brand-600 not-italic">Bridge</em>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors font-medium">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right — auth state */}
        <div className="hidden md:flex items-center gap-3">
          {isAuth ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/auth/login"
                className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors px-4 py-2">
                Увійти
              </Link>
              <Link href="/auth/register"
                className="text-sm font-medium bg-stone-900 text-white px-5 py-2.5 rounded-xl
                           hover:bg-stone-800 transition-colors">
                Розпочати →
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-sand-200 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={cn('block h-0.5 bg-stone-800 transition-all', menuOpen && 'rotate-45 translate-y-2')} />
            <span className={cn('block h-0.5 bg-stone-800 transition-all', menuOpen && 'opacity-0')} />
            <span className={cn('block h-0.5 bg-stone-800 transition-all', menuOpen && '-rotate-45 -translate-y-2')} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-sand-50/95 backdrop-blur-md
                        border-b border-sand-200 px-6 py-4 flex flex-col gap-3">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="text-sm font-medium text-stone-700 py-2"
              onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-sand-200">
            {isAuth ? (
              <>
                <Link href={user?.role === 'mentor' || user?.role === 'both' ? '/mentor/dashboard' : '/dashboard'}
                  className="text-sm font-medium text-center py-2.5 border border-stone-300 rounded-xl"
                  onClick={() => setMenuOpen(false)}>
                  Мій кабінет
                </Link>
                <button
                  onClick={() => { useAuthStore.getState().clearAuth(); setMenuOpen(false) }}
                  className="text-sm font-medium text-center py-2.5 text-red-500 border border-red-200 rounded-xl">
                  Вийти
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login"
                  className="text-sm font-medium text-center py-2.5 border border-stone-300 rounded-xl"
                  onClick={() => setMenuOpen(false)}>
                  Увійти
                </Link>
                <Link href="/auth/register"
                  className="text-sm font-medium text-center py-2.5 bg-stone-900 text-white rounded-xl"
                  onClick={() => setMenuOpen(false)}>
                  Розпочати →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
