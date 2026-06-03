import React from 'react'

const STEPS = [
  {
    num: '01',
    icon: '🔍',
    title: 'Знайди ментора',
    desc: 'Фільтруй за категорією, ціною та доступністю. Читай відгуки реальних клієнтів і дивись відео-знайомство.',
    detail: 'Пошук займає менше хвилини',
  },
  {
    num: '02',
    icon: '📅',
    title: 'Забронюй слот',
    desc: 'Обери зручний час і тривалість: 15, 30 або 60 хвилин. Оплата через Stripe — безпечно і миттєво.',
    detail: 'Підтвердження приходить за секунди',
  },
  {
    num: '03',
    icon: '🎯',
    title: 'Проведи сесію',
    desc: 'Відеодзвінок прямо у браузері — нічого встановлювати. Після сесії залишай відгук і отримуй бонусні кредити.',
    detail: 'Без зайвих додатків',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-xs font-medium text-brand-600 uppercase tracking-widest mb-3">Як це працює</p>
        <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-4">
          Три кроки до відповіді
        </h2>
        <p className="text-stone-400 text-lg max-w-md mx-auto">
          Від пошуку до сесії — менше ніж за 5 хвилин
        </p>
      </div>

      <div className="relative grid md:grid-cols-3 gap-6">

        {/* Connecting line — desktop only */}
        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-sand-300 to-transparent" />

        {STEPS.map((step, i) => (
          <div key={i} className="relative group">
            <div className="bg-white border border-sand-200 rounded-2xl p-7 hover:border-brand-200
                            hover:shadow-lg hover:shadow-brand-100/50 transition-all duration-300">

              {/* Number */}
              <div className="flex items-start justify-between mb-6">
                <span className="font-serif text-6xl font-light text-sand-200 leading-none select-none">
                  {step.num}
                </span>
                <span className="text-3xl">{step.icon}</span>
              </div>

              <h3 className="font-serif text-xl mb-3 text-stone-900">{step.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-5">{step.desc}</p>

              <div className="flex items-center gap-2 text-xs text-brand-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                {step.detail}
              </div>
            </div>

            {/* Arrow between steps */}
            {i < STEPS.length - 1 && (
              <div className="hidden md:flex absolute top-12 -right-4 w-8 h-8 items-center justify-center
                              bg-white border border-sand-200 rounded-full z-10 text-stone-300 text-xs">
                →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-14 text-center">
        <p className="text-sm text-stone-400 mb-4">Готовий спробувати?</p>
        <a
          href="/mentors"
          className="inline-flex items-center gap-2 bg-brand-500 text-white text-sm font-medium
                     px-7 py-3.5 rounded-xl hover:bg-brand-600 active:scale-95 transition-all shadow-lg shadow-brand-200"
        >
          Знайти ментора зараз
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  )
}