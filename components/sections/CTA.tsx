import React from 'react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-stone-900 rounded-3xl px-10 py-16 text-center overflow-hidden">

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-brand-600/15 blur-3xl" />
          </div>

          {/* Decorative dots */}
          <div className="absolute top-8 right-8 grid grid-cols-3 gap-1.5 opacity-20">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
            ))}
          </div>
          <div className="absolute bottom-8 left-8 grid grid-cols-3 gap-1.5 opacity-20">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
            ))}
          </div>

          <p className="text-xs font-medium text-brand-400 uppercase tracking-widest mb-5">
            Готовий розпочати?
          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight mb-6 text-balance">
            Твій перший ментор —<br />
            <em className="not-italic text-brand-400">за 5 хвилин</em>
          </h2>

          <p className="text-stone-400 text-lg mb-10 max-w-md mx-auto">
            Більше 2400 фахівців готові відповісти на твоє запитання вже сьогодні.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/mentors"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                         bg-brand-500 text-white text-sm font-medium px-8 py-4 rounded-xl
                         hover:bg-brand-400 active:scale-95 transition-all shadow-xl shadow-brand-900/30"
            >
              Знайти ментора
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/become-mentor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                         border border-stone-600 text-stone-300 text-sm font-medium px-8 py-4 rounded-xl
                         hover:border-stone-400 hover:text-white active:scale-95 transition-all"
            >
              Стати ментором
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 mt-10 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1l1.5 3 3.3.5-2.4 2.3.6 3.3L7 8.7 4 10.1l.6-3.3L2.2 4.5 5.5 4 7 1z" stroke="#4ade80" strokeWidth="1" fill="#4ade80" fillOpacity=".3"/>
              </svg>
              Безпечна оплата
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#4ade80" strokeWidth="1"/>
                <path d="M4.5 7l2 2 3-3" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Гарантія повернення
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="4" width="10" height="7" rx="1.5" stroke="#4ade80" strokeWidth="1"/>
                <path d="M5 4V3a2 2 0 014 0v1" stroke="#4ade80" strokeWidth="1"/>
              </svg>
              Захист даних
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}