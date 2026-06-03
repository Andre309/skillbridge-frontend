import React from 'react'
import Link from 'next/link'

interface EmptyStateProps {
  icon?:       string
  title:       string
  description: string
  action?:     { label: string; href: string }
}

export default function EmptyState({ icon = 'icon', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white
                    border border-sand-200 rounded-2xl">
      <span className="text-4xl mb-4">{icon}</span>
      <p className="font-medium text-stone-700 mb-1">{title}</p>
      <p className="text-sm text-stone-400 max-w-xs mb-5">{description}</p>
      {action && (
        <Link href={action.href}
          className="text-sm font-medium bg-stone-900 text-white px-5 py-2.5 rounded-xl
                     hover:bg-stone-800 transition-all">
          {action.label}
        </Link>
      )}
    </div>
  )
}
