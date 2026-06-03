'use client'
import React, { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { slug: '',            name: 'Всі' },
  { slug: 'development', name: 'Розробка' },
  { slug: 'design',      name: 'Дизайн' },
  { slug: 'product',     name: 'Продукт' },
  { slug: 'marketing',   name: 'Маркетинг' },
  { slug: 'career',      name: "Кар'єра" },
  { slug: 'ai-ml',       name: 'AI / ML' },
  { slug: 'business',    name: 'Бізнес' },
  { slug: 'finance',     name: 'Фінанси' },
]

const SORT_OPTIONS = [
  { value: 'rating',     label: 'За рейтингом' },
  { value: 'price_asc',  label: 'Спочатку дешевші' },
  { value: 'price_desc', label: 'Спочатку дорожчі' },
  { value: 'sessions',   label: 'За кількістю сесій' },
]

export default function MentorFilters({ total }: { total: number }) {
  const router     = useRouter()
  const pathname   = usePathname()
  const params     = useSearchParams()
  const [open, setOpen] = useState(false)

  const current = (key: string, fallback = '') => params.get(key) ?? fallback

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    router.push(`${pathname}?${next.toString()}`)
  }

  const clearAll = () => router.push(pathname)

  const hasFilters = ['category', 'minPrice', 'maxPrice', 'rating', 'featured', 'q']
    .some(k => params.has(k))

  return (
    <div className="space-y-4">

      {/* Search bar */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M10.5 10.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Пошук по імені або навичці..."
          defaultValue={current('q')}
          onChange={e => update('q', e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-sand-200 rounded-xl text-sm
                     text-stone-800 placeholder:text-stone-400 focus:outline-none
                     focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            onClick={() => update('category', cat.slug)}
            className={cn(
              'text-sm px-4 py-2 rounded-xl font-medium transition-all',
              current('category') === cat.slug
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-sand-200 text-stone-600 hover:border-stone-300'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Row: sort + advanced filters toggle + results count */}
      <div className="flex items-center justify-between gap-3 flex-wrap">

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select
            value={current('sort', 'rating')}
            onChange={e => update('sort', e.target.value)}
            className="text-sm bg-white border border-sand-200 rounded-xl px-3 py-2.5
                       text-stone-700 focus:outline-none focus:border-brand-300 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Advanced filters toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              'flex items-center gap-1.5 text-sm px-3 py-2.5 rounded-xl border transition-all',
              open || hasFilters
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white border-sand-200 text-stone-600 hover:border-stone-300'
            )}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1.5 3.5h11M3.5 7h7M5.5 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Фільтри
            {hasFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            )}
          </button>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
            >
              Скинути все
            </button>
          )}
        </div>

        <p className="text-sm text-stone-400">
          {total > 0 ? `${total} менторів` : 'Нічого не знайдено'}
        </p>
      </div>

      {/* Advanced filters panel */}
      {open && (
        <div className="bg-white border border-sand-200 rounded-2xl p-5 grid sm:grid-cols-3 gap-5">

          {/* Price range */}
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">Ціна за сесію</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Від $"
                defaultValue={current('minPrice')}
                onChange={e => update('minPrice', e.target.value)}
                className="w-full text-sm border border-sand-200 rounded-lg px-3 py-2
                           focus:outline-none focus:border-brand-300"
              />
              <span className="text-stone-300 flex-shrink-0">—</span>
              <input
                type="number"
                placeholder="До $"
                defaultValue={current('maxPrice')}
                onChange={e => update('maxPrice', e.target.value)}
                className="w-full text-sm border border-sand-200 rounded-lg px-3 py-2
                           focus:outline-none focus:border-brand-300"
              />
            </div>
          </div>

          {/* Min rating */}
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">Мінімальний рейтинг</p>
            <div className="flex gap-2">
              {[4, 4.5, 5].map(r => (
                <button
                  key={r}
                  onClick={() => update('rating', current('rating') === String(r) ? '' : String(r))}
                  className={cn(
                    'flex-1 text-sm py-2 rounded-lg border transition-all',
                    current('rating') === String(r)
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'border-sand-200 text-stone-600 hover:border-stone-300'
                  )}
                >
                  {r}+
                </button>
              ))}
            </div>
          </div>

          {/* Featured only */}
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">Додатково</p>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => update('featured', current('featured') === 'true' ? '' : 'true')}
                className={cn(
                  'w-10 h-5.5 rounded-full transition-all relative',
                  current('featured') === 'true' ? 'bg-brand-500' : 'bg-sand-200'
                )}
                style={{ height: 22 }}
              >
                <div className={cn(
                  'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all',
                  current('featured') === 'true' ? 'left-5' : 'left-0.5'
                )} />
              </div>
              <span className="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">
                Тільки Featured
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
