import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import type { MentorProfile } from '@/types'

interface MentorCardProps {
  mentor: MentorProfile
}

function Avatar({ mentor }: { mentor: MentorProfile }) {
  const initials = mentor.user.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const COLORS = [
    'bg-violet-100 text-violet-800',
    'bg-emerald-100 text-emerald-800',
    'bg-amber-100 text-amber-800',
    'bg-blue-100 text-blue-800',
    'bg-pink-100 text-pink-800',
    'bg-cyan-100 text-cyan-800',
  ]
  const color = COLORS[mentor.user.fullName.charCodeAt(0) % COLORS.length]

  if (mentor.user.avatarUrl) {
    return (
      <Image
        src={mentor.user.avatarUrl}
        alt={mentor.user.fullName}
        width={52}
        height={52}
        className="rounded-full object-cover"
      />
    )
  }

  return (
    <div className={`w-13 h-13 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${color}`}
         style={{ width: 52, height: 52 }}>
      {initials}
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12"
          fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'}>
          <path d="M6 1l1.2 2.4 2.7.4-2 1.9.5 2.7L6 7.2 3.6 8.4l.5-2.7-2-1.9 2.7-.4L6 1z"/>
        </svg>
      ))}
    </div>
  )
}

export default function MentorCard({ mentor }: MentorCardProps) {
  const minPrice = mentor.services.length > 0
    ? Math.min(...mentor.services.map(s => s.priceCents))
    : null

  const allTags = [...new Set(mentor.services.flatMap(s => s.tags))].slice(0, 4)

  return (
    <Link
      href={`/mentors/${mentor.id}`}
      className="group bg-white border border-sand-200 rounded-2xl p-5
                 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-50
                 transition-all duration-200 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">
          <Avatar mentor={mentor} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="font-medium text-stone-900 truncate group-hover:text-brand-700 transition-colors">
              {mentor.user.fullName}
            </p>
            {mentor.isVerified && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                <circle cx="8" cy="8" r="7" fill="#15b37e" fillOpacity=".15"/>
                <circle cx="8" cy="8" r="7" stroke="#15b37e" strokeWidth="1"/>
                <path d="M5 8l2 2 4-4" stroke="#15b37e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <p className="text-xs text-stone-400 truncate">{mentor.headline ?? mentor.position}</p>
        </div>

        {mentor.isFeatured && (
          <Badge variant="brand" className="flex-shrink-0">Featured</Badge>
        )}
      </div>

      {/* Rating + sessions */}
      {mentor.avgRating && (
        <div className="flex items-center gap-2 mb-4">
          <Stars rating={mentor.avgRating} />
          <span className="text-xs text-stone-500">
            {mentor.avgRating.toFixed(1)} ({mentor.totalReviews} відгуків)
          </span>
          <span className="text-stone-200">·</span>
          <span className="text-xs text-stone-400">{mentor.totalSessions} сесій</span>
        </div>
      )}

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {allTags.map(tag => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}

      {/* Company */}
      {mentor.company && (
        <p className="text-xs text-stone-400 mb-4 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1.5" y="4" width="9" height="6.5" rx="1" stroke="#a8a29e" strokeWidth="1"/>
            <path d="M4 4V2.5a2 2 0 014 0V4" stroke="#a8a29e" strokeWidth="1"/>
          </svg>
          {mentor.company}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-sand-100 flex items-center justify-between">
        <div>
          {minPrice !== null ? (
            <>
              <span className="text-xs text-stone-400">від </span>
              <span className="text-sm font-medium text-stone-900">{formatPrice(minPrice)}</span>
              <span className="text-xs text-stone-400">/сес.</span>
            </>
          ) : (
            <span className="text-xs text-stone-400">Ціна за запитом</span>
          )}
        </div>

        <span className="text-xs font-medium text-brand-600 group-hover:gap-2 flex items-center gap-1 transition-all">
          Переглянути
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  )
}