'use client'
import React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface PaginationProps {
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

export default function Pagination({ total, page, totalPages }: PaginationProps) {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()

  if (totalPages <= 1) return null

  const goTo = (p: number) => {
    const next = new URLSearchParams(params.toString())
    next.set('page', String(p))
    router.push(`${pathname}?${next.toString()}`)
  }

  // Генеруємо номери сторінок з "..."
  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3)          pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">

      {/* Prev */}
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium
                   border border-sand-200 text-stone-500 hover:border-stone-300 hover:text-stone-800
                   disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Назад
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 py-2 text-stone-400 text-sm">...</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={cn(
              'w-9 h-9 rounded-xl text-sm font-medium transition-all',
              p === page
                ? 'bg-stone-900 text-white'
                : 'border border-sand-200 text-stone-600 hover:border-stone-300 hover:text-stone-900'
            )}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium
                   border border-sand-200 text-stone-500 hover:border-stone-300 hover:text-stone-800
                   disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Далі
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}