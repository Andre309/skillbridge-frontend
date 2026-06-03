import Link from 'next/link'
import React from 'react'

const MENTORS = [
  {
    id: '1',
    initials: 'ІВ',
    name: 'Іван Василенко',
    role: 'Staff Engineer · Google',
    tags: ['System Design', 'Kotlin', 'Interview'],
    rating: 5.0,
    sessions: 142,
    price: 30,
    color: 'bg-violet-100 text-violet-800',
    badge: null,
  },
  {
    id: '2',
    initials: 'НК',
    name: 'Наталя Кравченко',
    role: 'UX Lead · Booking.com',
    tags: ['Figma', 'Research', 'Portfolio'],
    rating: 4.9,
    sessions: 98,
    price: 25,
    color: 'bg-emerald-100 text-emerald-800',
    badge: 'Топ тижня',
  },
  {
    id: '3',
    initials: 'РХ',
    name: 'Роман Харченко',
    role: 'Growth PM · Startup',
    tags: ['GTM', 'Analytics', 'B2B SaaS'],
    rating: 4.8,
    sessions: 61,
    price: 45,
    color: 'bg-amber-100 text-amber-800',
    badge: null,
  },
]

export default function FeaturedMentors() {
  return (
    <section className="py-20 bg-sand-100/60 border-y border-sand-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-medium text-brand-600 uppercase tracking-widest mb-3">Ментори</p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight">
              Топ тижня
            </h2>
          </div>
          <Link
            href="/mentors"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-stone-500
                       hover:text-stone-800 transition-colors"
          >
            Всі ментори
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {MENTORS.map((m) => (
            <Link
              key={m.id}
              href={`/mentors/${m.id}`}
              className={`group bg-white rounded-2xl border p-5 hover:shadow-md transition-all
                ${m.badge ? 'border-brand-300 ring-1 ring-brand-200' : 'border-sand-200 hover:border-sand-300'}`}
            >
              {m.badge && (
                <span className="inline-block text-xs font-medium bg-brand-50 text-brand-700
                                 border border-brand-200 px-2.5 py-1 rounded-full mb-4">
                  {m.badge}
                </span>
              )}

              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-3 ${m.color}`}>
                {m.initials}
              </div>
              <p className="font-medium text-stone-900 mb-0.5">{m.name}</p>
              <p className="text-sm text-stone-400 mb-3">{m.role}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {m.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 bg-sand-100 text-stone-500 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-sand-100">
                <div>
                  <span className="text-sm font-medium text-stone-900">від ${m.price}</span>
                  <span className="text-xs text-stone-400">/сес.</span>
                </div>
                <div className="text-xs text-stone-400">
                  ★ {m.rating} · {m.sessions} сесій
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}