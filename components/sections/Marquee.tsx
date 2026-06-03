import React from 'react'

const ITEMS = [
  'UX / UI Design', 'System Design', 'Node.js', 'React', 'Product Strategy',
  'Career Growth', 'PostgreSQL', 'AI / ML', 'Go', 'Marketing', 'Figma',
  'Interview Prep', 'DevOps', 'Branding', 'B2B SaaS', 'Python', 'AWS',
]

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS]
  return (
    <div className="border-y border-sand-200 bg-white/50 py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 mx-6 text-sm text-stone-400 font-medium">
            <span className="w-1 h-1 rounded-full bg-brand-400 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
