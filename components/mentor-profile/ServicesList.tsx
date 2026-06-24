'use client'
import React, { useState } from 'react'
import { cn, formatPrice } from '@/lib/utils'
import ServiceForm from './ServiceForm'
import type { Service } from '@/types'

interface ServicesListProps {
  services:       Service[]
  onAdd:          (data: Record<string, unknown>) => Promise<void>
  onUpdate:       (id: string, data: Record<string, unknown>) => Promise<void>
  onDelete:       (id: string) => Promise<void>
}

const DURATION_LABEL: Record<number, string> = {
  15: '15 хв', 30: '30 хв', 45: '45 хв', 60: '1 год', 90: '1.5 год',
}

export default function ServicesList({ services, onAdd, onUpdate, onDelete }: ServicesListProps) {
  const [adding,   setAdding]   = useState(false)
  const [editing,  setEditing]  = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити послугу?')) return
    setDeleting(id)
    try { await onDelete(id) }
    finally { setDeleting(null) }
  }

  return (
    <div className="bg-white border border-sand-200 rounded-2xl p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl">Послуги</h2>
          <p className="text-sm text-stone-400 mt-0.5">{services.length} послуг додано</p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 text-sm font-medium bg-stone-900 text-white
                       px-4 py-2.5 rounded-xl hover:bg-stone-800 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Додати послугу
          </button>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <div className="mb-4">
          <ServiceForm
            onSave={async (data) => { await onAdd(data); setAdding(false) }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {/* Services list */}
      {services.length === 0 && !adding ? (
        <div className="text-center py-12 border-2 border-dashed border-sand-200 rounded-2xl">
          <p className="text-stone-400 text-sm mb-3">Послуг ще немає</p>
          <button
            onClick={() => setAdding(true)}
            className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
          >
            Додати першу послугу →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(service => (
            <div key={service.id}>
              {editing === service.id ? (
                <ServiceForm
                  service={service}
                  onSave={async (data) => { await onUpdate(service.id, data); setEditing(null) }}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <div className={cn(
                  'border rounded-2xl p-4 flex items-start gap-4 transition-all',
                  service.isActive ? 'border-sand-200' : 'border-sand-200 opacity-50'
                )}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {service.isTrial && (
                        <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200
                                         px-2 py-0.5 rounded-full font-medium">
                          Безкоштовно
                        </span>
                      )}
                      {!service.isActive && (
                        <span className="text-xs bg-sand-100 text-stone-400 px-2 py-0.5 rounded-full">
                          Неактивна
                        </span>
                      )}
                      <p className="font-medium text-stone-900 text-sm">{service.title}</p>
                    </div>

                    {service.description && (
                      <p className="text-xs text-stone-400 mb-2 line-clamp-1">{service.description}</p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span>{DURATION_LABEL[service.durationMinutes] ?? `${service.durationMinutes} хв`}</span>
                      <span className="text-stone-200">·</span>
                      <span className="font-medium text-stone-700">
                        {service.isTrial ? 'Безкоштовно' : formatPrice(service.priceCents, service.currency)}
                      </span>
                      {service.tags.length > 0 && (
                        <>
                          <span className="text-stone-200">·</span>
                          <span className="truncate">{service.tags.slice(0, 3).join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setEditing(service.id)}
                      className="p-2 text-stone-400 hover:text-stone-700 hover:bg-sand-100
                                 rounded-lg transition-all"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M10.5 2.5l2 2-8 8H2.5v-2l8-8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      disabled={deleting === service.id}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50
                                 rounded-lg transition-all disabled:opacity-50"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M3 4h9M5 4V3h5v1M6 7v4M9 7v4M4 4l.5 8h6l.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
