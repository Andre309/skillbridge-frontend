'use client'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/uk'
import { cn, formatPrice } from '@/lib/utils'
import type { Booking } from '@/types'

dayjs.locale('uk')

const STATUS_CONFIG = {
  pending:     { label: 'Очікує оплати', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed:   { label: 'Підтверджено',  color: 'bg-brand-50 text-brand-700 border-brand-200' },
  in_progress: { label: 'Зараз',         color: 'bg-blue-50 text-blue-700 border-blue-200' },
  completed:   { label: 'Завершено',     color: 'bg-stone-100 text-stone-500 border-stone-200' },
  cancelled:   { label: 'Скасовано',     color: 'bg-red-50 text-red-500 border-red-200' },
  no_show:     { label: 'Не з\'явився',  color: 'bg-red-50 text-red-500 border-red-200' },
}

interface BookingCardProps {
  booking:    Booking
  role:       'mentee' | 'mentor'
  onCancel?:  (id: string) => void
  onReview?:  (id: string) => void
}

export default function BookingCard({ booking, role, onCancel, onReview }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false)
  const status  = STATUS_CONFIG[booking.status]
  const isPast  = dayjs(booking.scheduledAt).isBefore(dayjs())
  const canCancel = ['pending', 'confirmed'].includes(booking.status) && !isPast
  const canReview = booking.status === 'completed' && role === 'mentee' && !booking.review

  const person = role === 'mentee' ? booking.mentor.user : booking.mentee
  const initials = person.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)

  const handleCancel = async () => {
    setCancelling(true)
    await onCancel?.(booking.id)
    setCancelling(false)
  }

  return (
    <div className={cn(
      'bg-white border rounded-2xl p-5 transition-all',
      booking.status === 'cancelled' ? 'border-sand-200 opacity-60' : 'border-sand-200 hover:border-sand-300'
    )}>
      <div className="flex items-start gap-4">

        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0
                        flex items-center justify-center text-sm font-medium">
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-medium text-stone-900 text-sm">{person.fullName}</p>
              <p className="text-xs text-stone-400 truncate">{booking.service.title}</p>
            </div>
            <span className={cn('text-xs px-2.5 py-1 rounded-full border flex-shrink-0 font-medium', status.color)}>
              {status.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Date/time */}
            <span className="flex items-center gap-1.5 text-xs text-stone-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="#a8a29e" strokeWidth="1"/>
                <path d="M1 5h10M4 1v2M8 1v2" stroke="#a8a29e" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              {dayjs(booking.scheduledAt).format('D MMM, HH:mm')}
            </span>

            {/* Duration */}
            <span className="flex items-center gap-1.5 text-xs text-stone-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="#a8a29e" strokeWidth="1"/>
                <path d="M6 3.5v2.5l2 1.5" stroke="#a8a29e" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              {booking.durationMinutes} хв
            </span>

            {/* Price */}
            <span className="text-xs font-medium text-stone-700">
              {formatPrice(booking.priceCents, booking.currency)}
            </span>

            {/* Review stars if done */}
            {booking.review && (
              <span className="flex items-center gap-0.5 text-xs text-amber-500">
                {'★'.repeat(booking.review.rating)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {(canCancel || canReview || booking.status === 'confirmed') && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-sand-100">
          {booking.status === 'confirmed' && !isPast && (
            <a href={`/session/${booking.id}`}
              className="flex-1 text-center text-xs font-medium bg-stone-900 text-white
                         py-2.5 rounded-xl hover:bg-stone-800 transition-all">
              Приєднатись до сесії
            </a>
          )}
          {canReview && (
            <button onClick={() => onReview?.(booking.id)}
              className="flex-1 text-center text-xs font-medium bg-brand-50 text-brand-700
                         border border-brand-200 py-2.5 rounded-xl hover:bg-brand-100 transition-all">
              Залишити відгук
            </button>
          )}
          {canCancel && (
            <button onClick={handleCancel} disabled={cancelling}
              className="text-xs text-stone-400 hover:text-red-500 transition-colors px-3 py-2.5 disabled:opacity-50">
              {cancelling ? 'Скасуємо...' : 'Скасувати'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
