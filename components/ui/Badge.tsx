import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'brand' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full',
      variant === 'default' && 'bg-sand-100 text-stone-500',
      variant === 'brand'   && 'bg-brand-50 text-brand-700 border border-brand-200',
      variant === 'outline' && 'border border-stone-200 text-stone-500',
      className
    )}>
      {children}
    </span>
  )
}