import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import type { Service } from '@/types'

interface ServiceCardProps {
  service:  Service
  mentorId: string
}

const DURATION_LABEL: Record<number, string> = {
  15: '15 хв', 30: '30 хв', 45: '45 хв', 60: '1 год', 90: '1.5 год',
}

export default function ServiceCard({ service, mentorId }: ServiceCardProps) {
  return (
    <div className={`bg-white border rounded-2xl p-5 flex flex-col gap-4 transition-all
      ${service.isTrial
        ? 'border-brand-200 ring-1 ring-brand-100'
        : 'border-sand-200 hover:border-sand-300 hover:shadow-sm'
      }`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {service.isTrial && (
              <Badge variant="brand">Безкоштовно</Badge>
            )}
            <span className="inline-flex items-center gap-1 text-xs text-stone-400 bg-sand-50
                             border border-sand-200 px-2 py-0.5 rounded-full">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="#a8a29e" strokeWidth="1"/>
                <path d="M5 3v2l1.5 1.5" stroke="#a8a29e" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              {DURATION_LABEL[service.durationMinutes] ?? `${service.durationMinutes} хв`}
            </span>
          </div>
          <h3 className="font-medium text-stone-900">{service.title}</h3>
        </div>

        <div className="text-right flex-shrink-0">
          {service.isTrial ? (
            <span className="text-lg font-serif font-medium text-brand-600">Free</span>
          ) : (
            <>
              <span className="text-lg font-serif font-medium text-stone-900">
                {formatPrice(service.priceCents, service.currency)}
              </span>
              <p className="text-xs text-stone-400">за сесію</p>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {service.description && (
        <p className="text-sm text-stone-500 leading-relaxed">{service.description}</p>
      )}

      {/* Tags */}
      {service.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {service.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
        </div>
      )}

      {/* CTA */}
      <Link
        href={`/book/${service.id}?mentor=${mentorId}`}
        className={`mt-auto w-full text-center text-sm font-medium py-3 rounded-xl transition-all
          ${service.isTrial
            ? 'bg-brand-500 text-white hover:bg-brand-600 active:scale-95'
            : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-95'
          }`}
      >
        {service.isTrial ? 'Забронювати безкоштовно' : 'Забронювати сесію'}
      </Link>
    </div>
  )
}