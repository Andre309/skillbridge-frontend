'use client'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'

interface CalendarPickerProps {
  selectedDate: string | null
  onSelect:     (date: string) => void
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
const MONTHS   = ['Січень','Лютий','Березень','Квітень','Травень','Червень',
                   'Липень','Серпень','Вересень','Жовтень','Листопад','Грудень']

export default function CalendarPicker({ selectedDate, onSelect }: CalendarPickerProps) {
  const today = dayjs().startOf('day')
  const [viewMonth, setViewMonth] = useState(today)

  const startOfMonth  = viewMonth.startOf('month')
  const daysInMonth   = viewMonth.daysInMonth()
  // понеділок = 0 ... неділя = 6
  const firstDayIndex = (startOfMonth.day() + 6) % 7

  const days: (dayjs.Dayjs | null)[] = [
    ...Array(firstDayIndex).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => startOfMonth.add(i, 'day')),
  ]

  const prevMonth = () => setViewMonth(m => m.subtract(1, 'month'))
  const nextMonth = () => setViewMonth(m => m.add(1, 'month'))

  return (
    <div className="bg-white border border-sand-200 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          disabled={viewMonth.isSame(today, 'month')}
          className="w-8 h-8 flex items-center justify-center rounded-lg
                     hover:bg-sand-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p className="font-medium text-stone-800">
          {MONTHS[viewMonth.month()]} {viewMonth.year()}
        </p>

        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg
                     hover:bg-sand-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-stone-400 py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const dateStr   = day.format('YYYY-MM-DD')
          const isPast    = day.isBefore(today)
          const isWeekend = day.day() === 0 || day.day() === 6
          const isSelected = selectedDate === dateStr
          const isToday    = day.isSame(today, 'day')

          return (
            <button
              key={dateStr}
              onClick={() => !isPast && !isWeekend && onSelect(dateStr)}
              disabled={isPast || isWeekend}
              className={cn(
                'h-9 w-full rounded-xl text-sm font-medium transition-all',
                isSelected && 'bg-stone-900 text-white',
                !isSelected && isToday && 'border-2 border-brand-400 text-brand-700',
                !isSelected && !isToday && !isPast && !isWeekend &&
                  'hover:bg-sand-100 text-stone-700',
                (isPast || isWeekend) && 'text-stone-300 cursor-not-allowed',
              )}
            >
              {day.date()}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-stone-400 mt-4 text-center">
        Вихідні недоступні для бронювання
      </p>
    </div>
  )
}