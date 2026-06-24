'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Service } from '@/types'

interface ServiceFormProps {
  service?:  Service
  onSave:    (data: Record<string, unknown>) => Promise<void>
  onCancel:  () => void
}

const DURATIONS = [
  { value: 15,  label: '15 хв' },
  { value: 30,  label: '30 хв' },
  { value: 45,  label: '45 хв' },
  { value: 60,  label: '1 год' },
  { value: 90,  label: '1.5 год' },
]

export default function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [form, setForm] = useState({
    title:           service?.title ?? '',
    description:     service?.description ?? '',
    durationMinutes: service?.durationMinutes ?? 30,
    priceCents:      service ? service.priceCents / 100 : 25,
    tags:            service?.tags.join(', ') ?? '',
    isTrial:         service?.isTrial ?? false,
    isActive:        service?.isActive ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: string, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.title.trim())    e.title    = "Введіть назву послуги"
    if (!form.isTrial && form.priceCents <= 0) e.price = "Введіть ціну"
    return e
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      await onSave({
        title:           form.title,
        description:     form.description || undefined,
        durationMinutes: form.durationMinutes,
        priceCents:      form.isTrial ? 0 : Math.round(form.priceCents * 100),
        currency:        'USD',
        tags:            form.tags.split(',').map(t => t.trim()).filter(Boolean),
        isTrial:         form.isTrial,
        isActive:        form.isActive,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-sand-50 border border-sand-200 rounded-2xl p-5 space-y-4">
      <h3 className="font-medium text-stone-900">
        {service ? 'Редагування послуги' : 'Нова послуга'}
      </h3>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Назва</label>
        <input
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Фідбек на UX/UI дизайн"
          className={cn(
            'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all',
            errors.title
              ? 'border-red-300 focus:border-red-300 focus:ring-red-100'
              : 'border-sand-200 focus:border-brand-300 focus:ring-brand-100'
          )}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Опис</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={2}
          placeholder="Що отримає менті після сесії..."
          className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm resize-none
                     focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Тривалість</label>
          <div className="flex gap-2 flex-wrap">
            {DURATIONS.map(d => (
              <button
                key={d.value}
                type="button"
                onClick={() => set('durationMinutes', d.value)}
                className={cn(
                  'text-xs px-3 py-2 rounded-lg border font-medium transition-all',
                  form.durationMinutes === d.value
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'border-sand-200 text-stone-600 hover:border-stone-300'
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Ціна (USD)
          </label>
          {form.isTrial ? (
            <div className="border border-brand-200 bg-brand-50 rounded-xl px-4 py-2.5 text-sm text-brand-700">
              Безкоштовно
            </div>
          ) : (
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
              <input
                type="number"
                min={1}
                value={form.priceCents}
                onChange={e => set('priceCents', Number(e.target.value))}
                className={cn(
                  'w-full border rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2',
                  errors.price
                    ? 'border-red-300 focus:border-red-300 focus:ring-red-100'
                    : 'border-sand-200 focus:border-brand-300 focus:ring-brand-100'
                )}
              />
            </div>
          )}
          {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          Теги <span className="text-stone-400 font-normal">(через кому)</span>
        </label>
        <input
          value={form.tags}
          onChange={e => set('tags', e.target.value)}
          placeholder="Figma, UX Review, Portfolio"
          className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm
                     focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            onClick={() => set('isTrial', !form.isTrial)}
            className={cn(
              'w-10 rounded-full transition-all relative cursor-pointer',
              form.isTrial ? 'bg-brand-500' : 'bg-sand-200'
            )}
            style={{ height: 22 }}
          >
            <div className={cn(
              'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all',
              form.isTrial ? 'left-5' : 'left-0.5'
            )} />
          </div>
          <span className="text-sm text-stone-600">Безкоштовна пробна</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            onClick={() => set('isActive', !form.isActive)}
            className={cn(
              'w-10 rounded-full transition-all relative cursor-pointer',
              form.isActive ? 'bg-brand-500' : 'bg-sand-200'
            )}
            style={{ height: 22 }}
          >
            <div className={cn(
              'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all',
              form.isActive ? 'left-5' : 'left-0.5'
            )} />
          </div>
          <span className="text-sm text-stone-600">Активна</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-stone-900 text-white text-sm font-medium
                     px-5 py-2.5 rounded-xl hover:bg-stone-800 disabled:opacity-60 transition-all"
        >
          {saving ? 'Зберігаємо...' : 'Зберегти'}
        </button>
        <button
          onClick={onCancel}
          className="text-sm text-stone-500 hover:text-stone-800 px-4 py-2.5 transition-colors"
        >
          Скасувати
        </button>
      </div>
    </div>
  )
}
