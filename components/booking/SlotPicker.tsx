'use client'
import React from 'react'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

interface SlotPickerProps {
  slots:        string[]
  selected:     string | null
  onSelect:     (slot: string) => void
  loading:      boolean
  date:         string | null
}

export default function SlotPicker({ slots, selected, onSelect, loading, date }: SlotPickerProps) {
  if (!date) {
    return (
      <div className="bg-white border border-sand-200 rounded-2xl p-6 text-center">
        <p className="text-sm text-stone-400">Спочатку обери дату</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white border border-sand-200 rounded-2xl p-5">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-4">Доступний час</p>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white border border-sand-200 rounded-2xl p-6 text-center">
        <p className="text-sm font-medium text-stone-700 mb-1">На цей день немає слотів</p>
        <p className="text-xs text-stone-400">Обери іншу дату</p>
      </div>
    )
  }

  // Групуємо по частинах дня
  const morning   = slots.filter(s => dayjs(s).hour() < 12)
  const afternoon = slots.filter(s => dayjs(s).hour() >= 12 && dayjs(s).hour() < 17)
  const evening   = slots.filter(s => dayjs(s).hour() >= 17)

  const groups = [
    { label: 'Ранок',   items: morning },
    { label: 'День',    items: afternoon },
    { label: 'Вечір',   items: evening },
  ].filter(g => g.items.length > 0)

  return (
    <div className="bg-white border border-sand-200 rounded-2xl p-5">
      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-4">
        Доступний час
      </p>

      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.label}>
            <p className="text-xs text-stone-400 mb-2">{group.label}</p>
            <div className="grid grid-cols-3 gap-2">
              {group.items.map(slot => {
                const time = dayjs(slot).format('HH:mm')
                return (
                  <button
                    key={slot}
                    onClick={() => onSelect(slot)}
                    className={cn(
                      'py-2.5 rounded-xl text-sm font-medium transition-all',
                      selected === slot
                        ? 'bg-stone-900 text-white'
                        : 'border border-sand-200 text-stone-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700'
                    )}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}