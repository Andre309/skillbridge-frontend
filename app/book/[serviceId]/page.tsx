import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import BookingForm from '@/components/booking/BookingForm'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import { fetchServiceById, getMockServiceWithMentor } from '@/lib/booking'

interface PageProps {
  params:      { serviceId: string }
  searchParams: { mentor?: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const data = await fetchServiceById(params.serviceId)
    return { title: `Бронювання · ${data.title}` }
  } catch {
    return { title: 'Бронювання сесії' }
  }
}

const DURATION_LABEL: Record<number, string> = {
  15: '15 хв', 30: '30 хв', 45: '45 хв', 60: '1 год', 90: '1.5 год',
}

export default async function BookingPage({ params }: PageProps) {
  let data

  try {
    data = await fetchServiceById(params.serviceId)
  } catch {
    data = getMockServiceWithMentor(params.serviceId)
  }

  if (!data) notFound()

  const { mentor, ...service } = data

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
            <Link href="/mentors" className="hover:text-stone-700 transition-colors">Ментори</Link>
            <span>/</span>
            <Link href={`/mentors/${mentor.id}`} className="hover:text-stone-700 transition-colors">
              {mentor.user.fullName}
            </Link>
            <span>/</span>
            <span className="text-stone-700">Бронювання</span>
          </nav>

          <div className="grid lg:grid-cols-5 gap-8">

            {/* Left — booking form (3/5) */}
            <div className="lg:col-span-3">
              <h1 className="font-serif text-3xl tracking-tight mb-2">Оберіть дату і час</h1>
              <p className="text-stone-400 text-sm mb-7">
                Всі часи відображаються у вашому часовому поясі
              </p>
              <BookingForm service={service} mentor={mentor} />
            </div>

            {/* Right — summary sidebar (2/5) */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 space-y-4">

                {/* Service summary */}
                <div className="bg-white border border-sand-200 rounded-2xl p-6">
                  <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-4">
                    Деталі сесії
                  </p>

                  {/* Mentor */}
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-sand-100">
                    <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800
                                    flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {mentor.user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">{mentor.user.fullName}</p>
                      <p className="text-xs text-stone-400">{mentor.headline}</p>
                    </div>
                  </div>

                  {/* Service details */}
                  <div className="space-y-3 mb-5">
                    <div>
                      <p className="text-sm font-medium text-stone-800 mb-1">{service.title}</p>
                      {service.description && (
                        <p className="text-xs text-stone-500 leading-relaxed">{service.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-stone-500
                                       bg-sand-50 border border-sand-200 px-2.5 py-1 rounded-full">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <circle cx="5.5" cy="5.5" r="4.5" stroke="#a8a29e" strokeWidth="1"/>
                          <path d="M5.5 3v2.5l1.5 1.5" stroke="#a8a29e" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                        {DURATION_LABEL[service.durationMinutes] ?? `${service.durationMinutes} хв`}
                      </span>
                      {service.tags.slice(0, 2).map(tag => <Badge key={tag}>{tag}</Badge>)}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-4 border-t border-sand-100">
                    {service.isTrial ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-500">Вартість</span>
                        <span className="text-lg font-serif font-medium text-brand-600">Безкоштовно</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-stone-500">Вартість сесії</span>
                          <span className="text-sm text-stone-800">
                            {formatPrice(service.priceCents, service.currency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-stone-500">Комісія платформи</span>
                          <span className="text-sm text-stone-800">$0</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-sand-100">
                          <span className="text-sm font-medium text-stone-800">Разом</span>
                          <span className="text-lg font-serif font-medium text-stone-900">
                            {formatPrice(service.priceCents, service.currency)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Trust signals */}
                <div className="bg-white border border-sand-200 rounded-2xl p-5 space-y-3">
                  {[
                    { icon: '🔒', text: 'Безпечна оплата через Stripe' },
                    { icon: '↩️', text: 'Скасування безкоштовно за 24 год' },
                    { icon: '🎥', text: 'Відеодзвінок прямо у браузері' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-3 text-sm text-stone-500">
                      <span>{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>

                {/* Mentor rating */}
                {mentor.avgRating && (
                  <div className="bg-white border border-sand-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} width="13" height="13" viewBox="0 0 13 13"
                          fill={i <= Math.round(mentor.avgRating!) ? '#f59e0b' : '#e5e7eb'}>
                          <path d="M6.5 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L6.5 9.2 3.3 10.9l.6-3.6L1.3 4.8l3.6-.5L6.5 1z"/>
                        </svg>
                      ))}
                      <span className="text-sm font-medium text-stone-800">{mentor.avgRating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-stone-400">
                      {mentor.totalReviews} відгуків · {mentor.totalSessions} сесій
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}