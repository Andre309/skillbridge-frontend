import React from 'react'
import Image from 'next/image'
import type { MentorProfile } from '@/types'

const LANG_NAMES: Record<string, string> = {
  uk: 'Українська', en: 'English', de: 'Deutsch', pl: 'Polski', fr: 'Français',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14"
          fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'}>
          <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L7 1z"/>
        </svg>
      ))}
    </div>
  )
}

function Avatar({ mentor }: { mentor: MentorProfile }) {
  const initials = mentor.user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const COLORS = [
    'bg-violet-100 text-violet-800', 'bg-emerald-100 text-emerald-800',
    'bg-amber-100 text-amber-800',   'bg-blue-100 text-blue-800',
  ]
  const color = COLORS[mentor.user.fullName.charCodeAt(0) % COLORS.length]

  if (mentor.user.avatarUrl) {
    return (
      <Image src={mentor.user.avatarUrl} alt={mentor.user.fullName}
        width={96} height={96}
        className="rounded-2xl object-cover ring-4 ring-white shadow-lg" />
    )
  }
  return (
    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-medium
                     ring-4 ring-white shadow-lg ${color}`}>
      {initials}
    </div>
  )
}

export default function MentorProfileHeader({ mentor }: { mentor: MentorProfile }) {
  return (
    <div className="bg-white border border-sand-200 rounded-2xl p-7 mb-6">
      <div className="flex flex-col sm:flex-row gap-6">

        <Avatar mentor={mentor} />

        <div className="flex-1 min-w-0">
          {/* Name + badges */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="font-serif text-3xl tracking-tight">{mentor.user.fullName}</h1>
            {mentor.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs bg-brand-50 text-brand-700
                               border border-brand-200 px-2.5 py-1 rounded-full font-medium">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" fill="#15b37e" fillOpacity=".2"/>
                  <path d="M3.5 6l2 2 3-3" stroke="#15b37e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Верифікований
              </span>
            )}
            {mentor.isFeatured && (
              <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200
                               px-2.5 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Headline */}
          <p className="text-stone-500 mb-3">{mentor.headline}</p>

          {/* Rating + stats */}
          {mentor.avgRating && (
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Stars rating={mentor.avgRating} />
                <span className="text-sm font-medium text-stone-800">{mentor.avgRating.toFixed(1)}</span>
                <span className="text-sm text-stone-400">({mentor.totalReviews} відгуків)</span>
              </div>
              <span className="text-stone-200">|</span>
              <span className="text-sm text-stone-500">{mentor.totalSessions} сесій проведено</span>
              {mentor.yearsExperience && (
                <>
                  <span className="text-stone-200">|</span>
                  <span className="text-sm text-stone-500">{mentor.yearsExperience} років досвіду</span>
                </>
              )}
            </div>
          )}

          {/* Company + links */}
          <div className="flex flex-wrap items-center gap-4">
            {mentor.company && (
              <span className="flex items-center gap-1.5 text-sm text-stone-500">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1.5" y="4.5" width="11" height="8" rx="1" stroke="#a8a29e" strokeWidth="1"/>
                  <path d="M4.5 4.5V3a2.5 2.5 0 015 0v1.5" stroke="#a8a29e" strokeWidth="1"/>
                </svg>
                {mentor.company}
              </span>
            )}
            {mentor.languages.length > 0 && (
              <span className="flex items-center gap-1.5 text-sm text-stone-500">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="#a8a29e" strokeWidth="1"/>
                  <path d="M7 1.5C7 1.5 5 4 5 7s2 5.5 2 5.5M7 1.5C7 1.5 9 4 9 7s-2 5.5-2 5.5M1.5 7h11" stroke="#a8a29e" strokeWidth="1"/>
                </svg>
                {mentor.languages.map(l => LANG_NAMES[l] ?? l).join(', ')}
              </span>
            )}
            {mentor.linkedinUrl && (
              <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M12.5 1h-11C1.2 1 1 1.2 1 1.5v11c0 .3.2.5.5.5h11c.3 0 .5-.2.5-.5v-11c0-.3-.2-.5-.5-.5zM4.5 11.5H3V5.5h1.5v6zM3.75 4.75a.875.875 0 110-1.75.875.875 0 010 1.75zM11.5 11.5H10V8.25c0-.56-.01-1.28-.78-1.28-.78 0-.9.61-.9 1.24V11.5H6.82V5.5h1.43v.82h.02c.2-.38.68-.78 1.4-.78 1.5 0 1.78.99 1.78 2.27v3.69z"/>
                </svg>
                LinkedIn
              </a>
            )}
            {mentor.githubUrl && (
              <a href={mentor.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path fillRule="evenodd" d="M7 1a6 6 0 00-1.897 11.698c.3.055.41-.13.41-.29v-1.02c-1.67.363-2.02-.806-2.02-.806-.273-.693-.667-.878-.667-.878-.545-.373.04-.365.04-.365.603.043.92.62.92.62.535.918 1.404.652 1.746.499.055-.388.21-.652.38-.802-1.333-.152-2.733-.667-2.733-2.966 0-.655.234-1.19.616-1.61-.062-.152-.267-.76.058-1.585 0 0 .503-.16 1.646.614A5.74 5.74 0 017 5.49c.509.002 1.02.069 1.498.202 1.14-.775 1.643-.614 1.643-.614.327.825.121 1.433.06 1.585.384.42.615.955.615 1.61 0 2.306-1.403 2.812-2.74 2.96.215.186.408.552.408 1.113v1.648c0 .161.108.348.413.29A6.001 6.001 0 007 1z" clipRule="evenodd"/>
                </svg>
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {mentor.user.bio && (
        <p className="mt-6 pt-6 border-t border-sand-100 text-stone-600 leading-relaxed text-sm">
          {mentor.user.bio}
        </p>
      )}
    </div>
  )
}