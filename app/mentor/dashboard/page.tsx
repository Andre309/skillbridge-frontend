'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import 'dayjs/locale/uk'
import Header from '@/components/layout/Header'
import DashboardNav from '@/components/dashboard/DashboardNav'
import BookingCard from '@/components/dashboard/BookingCard'
import StatsCard from '@/components/dashboard/StatsCard'
import EmptyState from '@/components/dashboard/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/store/auth.store'
import { dashboardApi, MOCK_MENTOR_BOOKINGS } from '@/lib/dashboard'
import { formatPrice } from '@/lib/utils'
import type { Booking } from '@/types'

dayjs.locale('uk')

const NAV_ITEMS = [
  {
    label: 'Дашборд', href: '/mentor/dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>
  },
  {
    label: 'Мій профіль', href: '/mentor/profile',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  },
  {
    label: 'Послуги', href: '/mentor/services',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  },
  {
    label: 'Розклад', href: '/mentor/availability',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 6h12M6 3v0M10 3v0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  },
  {
    label: 'Виплати', href: '/mentor/payments',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 7h12" stroke="currentColor" strokeWidth="1.3"/><circle cx="5.5" cy="10" r="1" fill="currentColor"/></svg>
  },
  {
    label: 'Налаштування', href: '/settings',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M8 2v1M8 13v1M2 8h1M13 8h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  },
]

type TabFilter = 'upcoming' | 'all' | 'completed'

export default function MentorDashboard() {
  const { user, accessToken } = useAuthStore()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState<TabFilter>('upcoming')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardApi.getBookings('mentor', accessToken ?? '')
        setBookings(data)
      } catch {
        setBookings(MOCK_MENTOR_BOOKINGS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [accessToken])

  const upcoming   = bookings.filter(b => ['confirmed','pending','in_progress'].includes(b.status))
  const completed  = bookings.filter(b => b.status === 'completed')
  const totalEarned = completed.reduce((s, b) => s + Math.round(b.priceCents * 0.8), 0)
  const avgRating  = completed.filter(b => b.review).reduce((s,b,_,a) => s + (b.review?.rating ?? 0) / a.length, 0)

  // Наступна сесія
  const nextSession = [...upcoming]
    .sort((a,b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0]

  // Розклад на тиждень
  const weekDays = Array.from({length:7}, (_,i) => dayjs().add(i,'day'))
  const bookingsByDay = (day: dayjs.Dayjs) =>
    upcoming.filter(b => dayjs(b.scheduledAt).isSame(day, 'day'))

  const filtered = bookings.filter(b => {
    if (tab === 'upcoming')  return ['confirmed','pending','in_progress'].includes(b.status)
    if (tab === 'completed') return b.status === 'completed'
    return true
  })

  const TAB_LABELS: Record<TabFilter, string> = {
    upcoming: 'Заплановані', all: 'Всі', completed: 'Завершені',
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-20 bg-sand-50">
        <div className="max-w-6xl mx-auto px-6">

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl tracking-tight mb-1">
                Кабінет ментора
              </h1>
              <p className="text-stone-400">{user?.fullName ?? 'Ментор'}</p>
            </div>
            <Link href="/mentors/1"
              className="text-sm font-medium border border-sand-200 bg-white px-4 py-2.5 rounded-xl
                         hover:border-stone-300 transition-all">
              Мій публічний профіль →
            </Link>
          </div>

          <div className="flex gap-6">
            <DashboardNav items={NAV_ITEMS} />

            <main className="flex-1 min-w-0 space-y-6">

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? Array.from({length:4}).map((_,i) => <Skeleton key={i} className="h-28 rounded-2xl"/>) : (
                  <>
                    <StatsCard label="Зароблено" value={formatPrice(totalEarned)}
                      sub="після комісії платформи" trend="up" trendVal="+12%"
                      color="bg-brand-50"
                      icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="11" rx="2" stroke="#15b37e" strokeWidth="1.5"/><path d="M2 9h16" stroke="#15b37e" strokeWidth="1.5"/><circle cx="6" cy="13" r="1.5" fill="#15b37e"/></svg>}
                    />
                    <StatsCard label="Сесій проведено" value={completed.length}
                      sub="за весь час" color="bg-violet-50"
                      icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#7c3aed" strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    />
                    <StatsCard label="Заплановано" value={upcoming.length}
                      sub="майбутніх сесій" color="bg-amber-50"
                      icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="#d97706" strokeWidth="1.5"/><path d="M3 8h14M7 4V2M13 4V2" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                    />
                    <StatsCard label="Рейтинг"
                      value={avgRating > 0 ? avgRating.toFixed(1) : '—'}
                      sub={completed.filter(b=>b.review).length + ' відгуків'}
                      color="bg-amber-50"
                      icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="#f59e0b"><path d="M10 2l2.4 4.8 5.3.8-3.8 3.7 1 5.2L10 14l-4.9 2.5 1-5.2L2.3 7.6l5.3-.8L10 2z"/></svg>}
                    />
                  </>
                )}
              </div>

              {/* Weekly schedule */}
              <div className="bg-white border border-sand-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl">Розклад на тиждень</h2>
                  <Link href="/mentor/availability"
                    className="text-xs font-medium text-brand-600 hover:text-brand-800 transition-colors">
                    Налаштувати →
                  </Link>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, i) => {
                    const daySessions = bookingsByDay(day)
                    const isToday = day.isSame(dayjs(), 'day')
                    return (
                      <div key={i} className="text-center">
                        <p className={`text-xs mb-1 ${isToday ? 'text-brand-600 font-medium' : 'text-stone-400'}`}>
                          {day.format('dd')}
                        </p>
                        <div className={`text-sm font-medium w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2
                          ${isToday ? 'bg-stone-900 text-white' : 'text-stone-700'}`}>
                          {day.format('D')}
                        </div>
                        <div className="space-y-1">
                          {daySessions.slice(0,2).map(s => (
                            <div key={s.id} className="text-xs bg-brand-50 text-brand-700 rounded-md px-1 py-0.5 truncate">
                              {dayjs(s.scheduledAt).format('HH:mm')}
                            </div>
                          ))}
                          {daySessions.length > 2 && (
                            <div className="text-xs text-stone-400">+{daySessions.length - 2}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Next session highlight */}
              {nextSession && (
                <div className="bg-stone-900 text-white rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-400 mb-1">Наступна сесія</p>
                    <p className="font-serif text-xl mb-1">{nextSession.mentee.fullName}</p>
                    <p className="text-stone-400 text-sm">{nextSession.service.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-400 font-medium">
                      {dayjs(nextSession.scheduledAt).format('D MMM, HH:mm')}
                    </p>
                    <p className="text-stone-500 text-sm mb-3">{nextSession.durationMinutes} хв</p>
                    <a href={`/session/${nextSession.id}`}
                      className="text-xs font-medium bg-brand-500 text-white px-4 py-2 rounded-xl hover:bg-brand-400 transition-all">
                      Приєднатись
                    </a>
                  </div>
                </div>
              )}

              {/* Bookings */}
              <div>
                <h2 className="font-serif text-xl mb-4">Бронювання</h2>

                <div className="flex gap-1 bg-sand-100 p-1 rounded-xl mb-5 w-fit">
                  {(Object.keys(TAB_LABELS) as TabFilter[]).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`text-xs font-medium px-4 py-2 rounded-lg transition-all ${
                        tab === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                      }`}>
                      {TAB_LABELS[t]}
                      {t === 'upcoming' && upcoming.length > 0 && (
                        <span className="ml-1.5 bg-brand-100 text-brand-700 text-xs px-1.5 py-0.5 rounded-full">
                          {upcoming.length}
                        </span>
                      )}
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
                    title="Бронювань ще немає"
                    description="Коли менті бронюватимуть твої сесії — вони з'являться тут"
                    action={{ label: 'Налаштувати профіль', href: '/mentor/profile' }}
                  />
                ) : (
                  <div className="space-y-3">
                    {filtered.map(b => (
                      <BookingCard key={b.id} booking={b} role="mentor" />
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
