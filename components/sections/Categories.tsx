import Link from 'next/link'
import React from 'react'

const CATS = [
  { slug: 'development', name: 'Розробка',   icon: '⌨️', count: 340 },
  { slug: 'design',      name: 'Дизайн',     icon: '🎨', count: 185 },
  { slug: 'product',     name: 'Продукт',    icon: '📊', count: 120 },
  { slug: 'marketing',   name: 'Маркетинг',  icon: '📈', count: 98  },
  { slug: 'career',      name: "Кар'єра",    icon: '🎯', count: 210 },
  { slug: 'ai-ml',       name: 'AI / ML',    icon: '🤖', count: 76  },
  { slug: 'business',    name: 'Бізнес',     icon: '🏢', count: 143 },
  { slug: 'finance',     name: 'Фінанси',    icon: '💰', count: 89  },
]

export default function Categories() {
  return (
    <section className="py-20 max-w-6xl mx-auto px-6">
      <div className="mb-10">
        <p className="text-xs font-medium text-brand-600 uppercase tracking-widest mb-3">Категорії</p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight">
          Знайди фахівця <em className="not-italic text-stone-400">у своїй галузі</em>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATS.map((cat) => (
          <Link
            key={cat.slug}
            href={`/mentors?category=${cat.slug}`}
            className="group flex items-center gap-3 bg-white border border-sand-200 rounded-xl p-4
                       hover:border-brand-300 hover:bg-brand-50/50 transition-all hover:shadow-sm"
          >
            <span className="text-2xl">{cat.icon}</span>
            <div>
              <p className="text-sm font-medium text-stone-800 group-hover:text-brand-700 transition-colors">
                {cat.name}
              </p>
              <p className="text-xs text-stone-400">{cat.count} менторів</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}