import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/uk'
import type { Review } from '@/types'

dayjs.extend(relativeTime)
dayjs.locale('uk')

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 13 13"
          fill={i <= rating ? '#f59e0b' : '#e5e7eb'}>
          <path d="M6.5 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L6.5 9.2 3.3 10.9l.6-3.6L1.3 4.8l3.6-.5L6.5 1z"/>
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.reviewer.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="bg-white border border-sand-200 rounded-2xl p-5">
      {/* Reviewer info */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sand-200 flex items-center justify-center
                          text-xs font-medium text-stone-600 flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-stone-900">{review.reviewer.fullName}</p>
            <p className="text-xs text-stone-400">{dayjs(review.createdAt).fromNow()}</p>
          </div>
        </div>
        <Stars rating={review.rating} />
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-stone-600 leading-relaxed mb-3">
          &ldquo;{review.comment}&rdquo;
        </p>
      )}

      {/* Mentor reply */}
      {review.mentorReply && (
        <div className="mt-3 pt-3 border-t border-sand-100">
          <p className="text-xs font-medium text-stone-400 mb-1">Відповідь ментора</p>
          <p className="text-sm text-stone-500 italic">{review.mentorReply}</p>
        </div>
      )}
    </div>
  )
}

interface ReviewsListProps {
  reviews:    Review[]
  total:      number
  avgRating?: number
}

export default function ReviewsList({ reviews, total, avgRating }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-sand-200 rounded-2xl">
        <p className="text-stone-400 text-sm">Ще немає відгуків</p>
      </div>
    )
  }

  return (
    <div>
      {/* Summary */}
      {avgRating && (
        <div className="flex items-center gap-4 mb-6 bg-white border border-sand-200 rounded-2xl p-5">
          <div className="text-center">
            <p className="font-serif text-4xl font-light text-stone-900">{avgRating.toFixed(1)}</p>
            <Stars rating={avgRating} />
            <p className="text-xs text-stone-400 mt-1">{total} відгуків</p>
          </div>
          <div className="flex-1 space-y-2">
            {[5,4,3,2,1].map(star => {
              const count  = reviews.filter(r => r.rating === star).length
              const pct    = total > 0 ? (count / total) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 w-3">{star}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="#f59e0b">
                    <path d="M6 1l1.2 2.4 2.7.4-2 1.9.5 2.7L6 7.2 3.6 8.4l.5-2.7-2-1.9 2.7-.4L6 1z"/>
                  </svg>
                  <div className="flex-1 h-1.5 bg-sand-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-stone-400 w-4">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Review cards */}
      <div className="space-y-4">
        {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
      </div>
    </div>
  )
}