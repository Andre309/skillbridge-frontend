import React from 'react'
import Link from 'next/link'

const PLANS = [
  {
    name:     'Starter',
    price:    0,
    period:   'назавжди безкоштовно',
    desc:     'Ідеально для старту',
    color:    'border-sand-200',
    cta:      { label: 'Зареєструватись', href: '/auth/register', style: 'border' },
    features: [
      'До 5 активних послуг',
      'Базова сторінка профілю',
      'Комісія платформи 20%',
      'Виплати раз на тиждень',
      'Email-підтримка',
    ],
    missing: ['Featured у пошуку', 'Аналітика і статистика'],
  },
  {
    name:     'Pro',
    price:    19,
    period:   'на місяць',
    desc:     'Для активних менторів',
    color:    'border-brand-400 ring-2 ring-brand-100',
    badge:    'Найпопулярніший',
    cta:      { label: 'Обрати Pro →', href: '/auth/register?plan=pro', style: 'fill' },
    features: [
      'Необмежені послуги',
      'Featured у пошуку',
      'Комісія платформи 12%',
      'Виплати раз на тиждень',
      'Аналітика і статистика',
      'Пріоритетна підтримка',
    ],
    missing: [],
  },
  {
    name:     'Business',
    price:    79,
    period:   'на місяць / команда',
    desc:     'Для компаній і агенцій',
    color:    'border-sand-200',
    cta:      { label: 'Зв\'язатись з нами', href: '/contact', style: 'border' },
    features: [
      'До 10 менторів у команді',
      'Корпоративний дашборд',
      'Комісія платформи 8%',
      'Щоденні виплати',
      'Повна аналітика команди',
      'Виділений менеджер',
    ],
    missing: [],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-stone-900 text-white">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <p className="text-xs font-medium text-brand-400 uppercase tracking-widest mb-3">Тарифи</p>
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-4">
            Починай безкоштовно,<br />
            <em className="not-italic text-stone-400">зростай на Pro</em>
          </h2>
          <p className="text-stone-400 text-lg max-w-md mx-auto">
            Для менторів. Менті платять лише за сесії.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-stone-800/50 border rounded-2xl p-7 flex flex-col ${plan.color}`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white
                                 text-xs font-medium px-4 py-1.5 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <div className="mb-7">
                <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-1">{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-serif text-5xl font-light">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                </div>
                <p className="text-sm text-stone-500">{plan.period}</p>
                <p className="text-sm text-stone-400 mt-2">{plan.desc}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-stone-300">
                    <svg className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-stone-600">
                    <svg className="w-4 h-4 text-stone-700 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                      <path d="M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.cta.href}
                className={`w-full text-center text-sm font-medium py-3 rounded-xl transition-all ${
                  plan.cta.style === 'fill'
                    ? 'bg-brand-500 text-white hover:bg-brand-400'
                    : 'border border-stone-600 text-stone-300 hover:border-stone-400 hover:text-white'
                }`}
              >
                {plan.cta.label}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-stone-500 mt-8">
          Всі тарифи включають SSL, захист від шахрайства та підтримку Stripe Connect
        </p>
      </div>
    </section>
  )
}