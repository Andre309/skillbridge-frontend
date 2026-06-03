import React from 'react'

const REVIEWS = [
  {
    text: 'За 30 хвилин з Марією отримала більше фідбеку на свій портфоліо, ніж за місяць самостійної роботи. Тепер знаю точно що виправити.',
    author: 'Анастасія Мороз',
    role: 'Junior UX Designer',
    rating: 5,
    avatar: 'АМ',
    color: 'bg-pink-100 text-pink-800',
  },
  {
    text: 'Дмитро розібрав мій код і пояснив 3 антипатерни яких я навіть не помічав. Дуже структурована і корисна сесія.',
    author: 'Олексій Бондаренко',
    role: 'Backend Developer',
    rating: 5,
    avatar: 'ОБ',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    text: 'Готувався до інтерв\'ю в FAANG. Іван провів mock interview і дав чітку програму підготовки. Через 2 місяці отримав оффер від Amazon.',
    author: 'Микола Савченко',
    role: 'Software Engineer',
    rating: 5,
    avatar: 'МС',
    color: 'bg-violet-100 text-violet-800',
  },
  {
    text: 'Олена допомогла структурувати roadmap продукту і знайти слабкі місця в нашій GTM-стратегії. Дуже практично і без води.',
    author: 'Катерина Лисенко',
    role: 'Product Manager',
    rating: 5,
    avatar: 'КЛ',
    color: 'bg-amber-100 text-amber-800',
  },
  {
    text: 'Нарешті знайшла ментора який говорить конкретно. Марія показала як переробити 3 кейси у портфоліо і де шукати роботу в Європі.',
    author: 'Вікторія Гнатюк',
    role: 'UI Designer',
    rating: 5,
    avatar: 'ВГ',
    color: 'bg-emerald-100 text-emerald-800',
  },
  {
    text: 'Платформа дуже зручна. Забронював сесію за 2 хвилини, відео працювало без проблем. Ментор був точно в час.',
    author: 'Артем Коваленко',
    role: 'Fullstack Developer',
    rating: 5,
    avatar: 'АК',
    color: 'bg-cyan-100 text-cyan-800',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#f59e0b">
          <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L7 1z"/>
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-xs font-medium text-brand-600 uppercase tracking-widest mb-3">Відгуки</p>
        <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-4">
          Що кажуть користувачі
        </h2>
        <div className="flex items-center justify-center gap-3 text-sm text-stone-400">
          <Stars count={5} />
          <span>4.9 із 5 на основі 18 000+ сесій</span>
        </div>
      </div>

      {/* Masonry-style grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {REVIEWS.map((r, i) => (
          <div
            key={i}
            className="break-inside-avoid bg-white border border-sand-200 rounded-2xl p-6
                       hover:border-sand-300 hover:shadow-sm transition-all"
          >
            <Stars count={r.rating} />

            <p className="mt-4 mb-6 text-sm text-stone-600 leading-relaxed">
              &ldquo;{r.text}&rdquo;
            </p>

            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${r.color}`}>
                {r.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-stone-900">{r.author}</p>
                <p className="text-xs text-stone-400">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}