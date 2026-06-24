'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import DashboardNav from '@/components/dashboard/DashboardNav'
import ProfileForm from '@/components/mentor-profile/ProfileForm'
import ServicesList from '@/components/mentor-profile/ServicesList'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/store/auth.store'
import { mentorProfileApi, MOCK_MENTOR_PROFILE, MOCK_SERVICES } from '@/lib/mentor-profile'
import type { MentorProfile, Service } from '@/types'

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
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 7h12" stroke="currentColor" strokeWidth="1.3"/></svg>
  },
]

export default function MentorProfilePage() {
  const { accessToken } = useAuthStore()
  const [profile,  setProfile]  = useState<MentorProfile | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading,  setLoading]  = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'services'>('profile')

  useEffect(() => {
    const load = async () => {
      try {
        const [prof, svcs] = await Promise.all([
          mentorProfileApi.getMyProfile(accessToken ?? ''),
          mentorProfileApi.getServices('me', accessToken ?? ''),
        ])
        setProfile(prof)
        setServices(svcs)
      } catch {
        setProfile(MOCK_MENTOR_PROFILE)
        setServices(MOCK_SERVICES)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [accessToken])

  const handleSaveProfile = async (data: Record<string, unknown>) => {
    const updated = await mentorProfileApi.updateProfile(accessToken ?? '', data)
    setProfile(updated)
  }

  const handleAddService = async (data: Record<string, unknown>) => {
    const newSvc = await mentorProfileApi.createService(accessToken ?? '', data)
    setServices(prev => [...prev, newSvc])
  }

  const handleUpdateService = async (id: string, data: Record<string, unknown>) => {
    const updated = await mentorProfileApi.updateService(accessToken ?? '', id, data)
    setServices(prev => prev.map(s => s.id === id ? updated : s))
  }

  const handleDeleteService = async (id: string) => {
    await mentorProfileApi.deleteService(accessToken ?? '', id)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-20 bg-sand-50">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl tracking-tight mb-1">Мій профіль</h1>
              <p className="text-stone-400">Налаштуй свою сторінку ментора</p>
            </div>
            {profile && (
              <Link
                href={`/mentors/${profile.id}`}
                target="_blank"
                className="flex items-center gap-2 text-sm font-medium border border-sand-200
                           bg-white px-4 py-2.5 rounded-xl hover:border-stone-300 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6 2H2.5A1.5 1.5 0 001 3.5v8A1.5 1.5 0 002.5 13h8A1.5 1.5 0 0012 11.5V8M8 1h5v5M13 1L6 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Публічний профіль
              </Link>
            )}
          </div>

          <div className="flex gap-6">
            <DashboardNav items={NAV_ITEMS} />

            <main className="flex-1 min-w-0 space-y-5">

              {/* Tabs */}
              <div className="flex gap-1 bg-sand-100 p-1 rounded-xl w-fit">
                {([['profile', 'Профіль'], ['services', 'Послуги']] as const).map(([tab, label]) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm font-medium px-5 py-2 rounded-lg transition-all ${
                      activeTab === tab
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-96 rounded-2xl" />
                  <Skeleton className="h-48 rounded-2xl" />
                </div>
              ) : (
                <>
                  {activeTab === 'profile' && profile && (
                    <>
                      {/* Profile completeness */}
                      {(() => {
                        const fields = [
                          profile.headline,
                          profile.company,
                          profile.user.bio,
                          profile.languages.length > 0,
                          profile.linkedinUrl,
                        ]
                        const filled  = fields.filter(Boolean).length
                        const pct     = Math.round((filled / fields.length) * 100)
                        return (
                          <div className="bg-white border border-sand-200 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-stone-700">
                                Заповненість профілю
                              </p>
                              <span className={`text-sm font-medium ${
                                pct >= 80 ? 'text-brand-600' : 'text-amber-600'
                              }`}>
                                {pct}%
                              </span>
                            </div>
                            <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  pct >= 80 ? 'bg-brand-500' : 'bg-amber-400'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            {pct < 80 && (
                              <p className="text-xs text-stone-400 mt-2">
                                Заповни профіль на 80%+ щоб з'явитись у пошуку
                              </p>
                            )}
                          </div>
                        )
                      })()}

                      <ProfileForm
                        profile={profile}
                        onSave={handleSaveProfile}
                      />
                    </>
                  )}

                  {activeTab === 'services' && (
                    <ServicesList
                      services={services}
                      onAdd={handleAddService}
                      onUpdate={handleUpdateService}
                      onDelete={handleDeleteService}
                    />
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
