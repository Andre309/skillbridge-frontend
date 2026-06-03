'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import DashboardNav from '@/components/dashboard/DashboardNav'
import BookingCard from '@/components/dashboard/BookingCard'
import StatsCard from '@/components/dashboard/StatsCard'
import EmptyState from '@/components/dashboard/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/store/auth.store'
import { dashboardApi, MOCK_MENTEE_BOOKINGS } from '@/lib/dashboard'
import { formatPrice } from '@/lib/utils'
import type { Booking } from '@/types'

const NAV_ITEMS = [
  {
    label: 'Огляд', href: '/dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>
  },
  {
    label: 'Мої сесії', href: '/dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 6h12M6 3v0M10 3v0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  },
  {
    label: 'Знайти ментора', href: '/mentors',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  },
  {
    label: 'Налаштування', href: '/settings',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  },
]

type TabFilter = 'all' | 'upcoming' | 'completed' | 'cancelled'

export default function MenteeDashboard() {
  const { user, accessToken } = useAuthStore()
  const [bookings,  setBookings]  = useState<Booking[]>([])
  const [loading,   setLoading]   = useState(true)
  const [tab,       setTab]       = useState<TabFilter>('all')
  const [reviewFor, setReviewFor] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardApi.getBookings('mentee', accessToken ?? '')
        setBookings(data)
      } catch {
        setBookings(MOCK_MENTEE_BOOKINGS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [accessToken])

  const handleCancel = async (id: string) => {
    await dashboardApi.cancelBooking(id, accessToken ?? '')
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b))
  }

  // Stats
  const completed  = bookings.filter(b => b.status === 'completed')
  const upcoming   = bookings.filter(b => ['confirmed','pending'].includes(b.status))
  const totalSpent = completed.reduce((s, b) => s + b.priceCents, 0)
  const nextSession = upcoming.sort((a,b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0]

  const filtered = bookings.filter(b => {
    if (tab === 'upcoming')  return ['confirmed','pending','in_progress'].includes(b.status)
    if (tab === 'completed') return b.status === 'completed'
    if (tab === 'cancelled') return b.status === 'cancelled'
    return true
  })

  const TAB_LABELS: Record<TabFilter, string> = {
    all: 'Всі', upcoming: 'Заплановані', completed: 'Завершені', cancelled: 'Скасовані',
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-20 bg-sand-50">
        <div className="max-w-6xl mx-auto px-6">

          {/* Page header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl tracking-tight mb-1">
              Привіт, {user?.fullName?.split(' ')[0] ?? 'Користувач'}!
            </h1>
            <p className="text-stone-400">Твій особистий кабінет</p>
          </div>

          <div className="flex gap-6">
            <DashboardNav items={NAV_ITEMS} />

            <main className="flex-1 min-w-0 space-y-6">

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? Array.from({length:4}).map((_,i) => <Skeleton key={i} className="h-28 rounded-2xl"/>) : (
                  <>
                    <StatsCard label="Завершених сесій" value={completed.length}
                      sub="за весь час" trend="up" trendVal="+2 цього місяця"
                      color="bg-brand-50"
                      icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#15b37e" strokeWidth="1.5"/><path d="M6 10l3 3 5-5" stroke="#15b37e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    />
                    <StatsCard label="Заплановано" value={upcoming.length}
                      sub="майбутніх сесій" color="bg-violet-50"
                      icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="#7c3aed" strokeWidth="1.5"/><path d="M3 8h14M7 4V2M13 4V2" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                    />
                    <StatsCard label="Витрачено" value={formatPrice(totalSpent)}
                      sub="на менторство" color="bg-amber-50"
                      icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="11" rx="2" stroke="#d97706" strokeWidth="1.5"/><path d="M2 9h16" stroke="#d97706" strokeWidth="1.5"/></svg>}
                    />
                    <StatsCard label="Наступна сесія"
                      value={nextSession ? new Date(nextSession.scheduledAt).toLocaleDateString('uk-UA', {day:'numeric',month:'short'}) : '—'}
                      sub={nextSession ? nextSession.mentor.user.fullName : 'Немає запланованих'}
                      color="bg-blue-50"
                      icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#2563eb" strokeWidth="1.5"/><path d="M10 6v4l3 3" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                    />
                  </>
                )}
              </div>

              {/* Quick action */}
              <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-6 text-white flex items-center justify-between">
                <div>
                  <p className="font-serif text-xl mb-1">Знайди свого наступного ментора</p>
                  <p className="text-brand-100 text-sm">2 400+ фахівців готові допомогти</p>
                </div>
                <Link href="/mentors"
                  className="flex-shrink-0 bg-white text-brand-700 text-sm font-medium
                             px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-all">
                  Знайти →
                </Link>
              </div>

              {/* Bookings list */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl">Мої сесії</h2>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-sand-100 p-1 rounded-xl mb-5 w-fit">
                  {(Object.keys(TAB_LABELS) as TabFilter[]).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`text-xs font-medium px-4 py-2 rounded-lg transition-all ${
                        tab === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                      }`}>
                      {TAB_LABELS[t]}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl"/>)}
                  </div>
                ) : filtered.length === 0 ? (
                  <EmptyState
                    icon="icon"
                    title="Сесій ще немає"
                    description="Знайди ментора і забронюй свою першу сесію"
                    action={{ label: 'Знайти ментора', href: '/mentors' }}
                  />
                ) : (
                  <div className="space-y-3">
                    {filtered.map(b => (
                      <BookingCard key={b.id} booking={b} role="mentee"
                        onCancel={handleCancel}
                        onReview={setReviewFor}
                      />
                    ))}
                  </div>
                )}
              </div>

            </main>
          </div>
        </div>
      </div>
    </>
  )
}
