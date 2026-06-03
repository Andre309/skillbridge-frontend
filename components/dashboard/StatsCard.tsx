import React from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label:    string
  value:    string | number
  sub?:     string
  trend?:   'up' | 'down' | 'neutral'
  trendVal?: string
  icon:     React.ReactNode
  color?:   string
}

export default function StatsCard({ label, value, sub, trend, trendVal, icon, color }: StatsCardProps) {
  return (
    <div className="bg-white border border-sand-200 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color ?? 'bg-sand-100')}>
          {icon}
        </div>
        {trend && trendVal && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            trend === 'up'      && 'bg-brand-50 text-brand-700',
            trend === 'down'    && 'bg-red-50 text-red-600',
            trend === 'neutral' && 'bg-sand-100 text-stone-500',
          )}>
            {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''}{trendVal}
          </span>
        )}
      </div>
      <p className="font-serif text-3xl font-light text-stone-900 mb-1">{value}</p>
      <p className="text-sm text-stone-500">{label}</p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </div>
  )
}
