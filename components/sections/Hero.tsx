import Link from 'next/link'
import React from 'react'

const STATS = [
  { value: '2 400+', label: 'Менторів' },
  { value: '18 000+', label: 'Сесій' },
  { value: '4.9 ★', label: 'Рейтинг' },
]

const PREVIEW_MENTORS = [
  { initials: 'МК', name: 'Марія Коваль',     role: 'Senior UX Designer',    price: '$25', color: 'bg-emerald-100 text-emerald-800', online: true },
  { initials: 'ДП', name: 'Дмитро Петренко',  role: 'Tech Lead · Node.js',   price: '$35', color: 'bg-violet-100 text-violet-800',   online: true },
  { initials: 'ОС', name: 'Олена Савченко',   role: 'Product Manager · SaaS', price: '$40', color: 'bg-amber-100 text-amber-800',    online: false },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-sand-300/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-100/20 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center w-full">

        {/* Left — text */}
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700
                          text-xs font-medium px-3.5 py-1.5 rounded-full mb-7
                          animate-fade-up opacity-0-init">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Миттєвий доступ до експертів
          </div>

          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6
                         animate-fade-up opacity-0-init animate-delay-100 text-balance">
            Запитай{' '}
            <em className="text-brand-600 not-italic">фахівця</em>
            <br />за 15 хвилин
          </h1>

          <p className="text-lg text-stone-500 leading-relaxed mb-9
                        animate-fade-up opacity-0-init animate-delay-200 max-w-md">
            Маркетплейс мікро-менторства. Бронюй сесії з реальними спеціалістами —
            без довгих курсів і підписок.
          </p>

          <div className="flex flex-wrap gap-3 mb-10 animate-fade-up opacity-0-init animate-delay-300">
            <Link
              href="/mentors"
              className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm font-medium
                         px-6 py-3.5 rounded-xl hover:bg-stone-800 active:scale-95 transition-all"
            >
              Знайти ментора
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/become-mentor"
              className="inline-flex items-center gap-2 bg-white border border-stone-200 text-stone-700
                         text-sm font-medium px-6 py-3.5 rounded-xl hover:border-stone-300 hover:bg-stone-50
                         active:scale-95 transition-all shadow-sm"
            >
              Стати ментором
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 animate-fade-up opacity-0-init animate-delay-400">
            {STATS.map((s, i) => (
              <div key={i}>
                <p className="font-serif text-2xl font-medium">{s.value}</p>
                <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — floating card */}
        <div className="hidden md:block animate-fade-up opacity-0-init animate-delay-300">
          <div className="relative">

            {/* Main card */}
            <div className="bg-white rounded-2xl border border-sand-200 shadow-xl shadow-stone-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Онлайн зараз</p>
                <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-full font-medium">
                  {PREVIEW_MENTORS.filter(m => m.online).length} ментори
                </span>
              </div>

              <div className="space-y-3">
                {PREVIEW_MENTORS.map((m, i) => (
                  <div key={i}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-sand-50 transition-colors cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${m.color}`}>
                      {m.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{m.name}</p>
                      <p className="text-xs text-stone-400 truncate">{m.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-brand-600">{m.price}<span className="text-stone-400 font-normal">/30хв</span></p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        m.online
                          ? 'bg-brand-50 text-brand-700'
                          : 'bg-sand-100 text-stone-400'
                      }`}>
                        {m.online ? '● онлайн' : 'завтра'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/mentors"
                className="mt-4 w-full block text-center text-sm font-medium text-stone-500
                           hover:text-stone-800 border border-stone-200 hover:border-stone-300
                           py-2.5 rounded-xl transition-all"
              >
                Переглянути всіх →
              </Link>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-white border border-sand-200 shadow-lg rounded-xl px-4 py-2.5 animate-float">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <div>
                  <p className="text-xs font-medium text-stone-800">Середня оцінка</p>
                  <p className="text-lg font-serif font-medium text-stone-900">4.9 / 5.0</p>
                </div>
              </div>
            </div>

            {/* Floating badge 2 */}
            <div className="absolute -bottom-4 -left-4 bg-brand-500 text-white shadow-lg rounded-xl px-4 py-2.5">
              <p className="text-xs font-medium opacity-80">Наступна сесія</p>
              <p className="text-sm font-medium">Сьогодні, 15:00 ���</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
