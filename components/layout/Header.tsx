'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Знайти ментора', href: '/mentors' },
  { label: 'Стати ментором', href: '/become-mentor' },
  { label: 'Як це працює',  href: '/#how-it-works' },
  { label: 'Тарифи',        href: '/#pricing' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors px-4 py-2"
          >
            Увійти
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-medium bg-stone-900 text-white px-5 py-2.5 rounded-xl hover:bg-stone-800 transition-colors"
          >
            Реєстрація
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-sand-200 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={cn('block h-0.5 bg-stone-800 transition-all', open && 'rotate-45 translate-y-2')} />
            <span className={cn('block h-0.5 bg-stone-800 transition-all', open && 'opacity-0')} />
            <span className={cn('block h-0.5 bg-stone-800 transition-all', open && '-rotate-45 -translate-y-2')} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-sand-50/95 backdrop-blur-md border-b border-sand-200 px-6 py-4 flex flex-col gap-3">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="text-sm font-medium text-stone-700 py-2"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-sand-200">
            <Link href="/auth/login" className="text-sm font-medium text-center py-2.5 border border-stone-300 rounded-xl">Увійти</Link>
            <Link href="/auth/register" className="text-sm font-medium text-center py-2.5 bg-stone-900 text-white rounded-xl">Розпочати →</Link>
          </div>
        </div>
      )}
    </header>
  )
}
