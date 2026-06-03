'use client'
import React, { useState, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import CalendarPicker from './CalendarPicker'
import SlotPicker from './SlotPicker'
import { formatPrice } from '@/lib/utils'
import { fetchAvailableSlots, getMockSlots, createBooking, createPaymentIntent } from '@/lib/booking'
import type { Service, MentorProfile } from '@/types'

interface BookingFormProps {
  service: Service
  mentor:  MentorProfile
}

type Step = 'datetime' | 'details' | 'payment' | 'success'

export default function BookingForm({ service, mentor }: BookingFormProps) {
  const [step, setStep]             = useState<Step>('datetime')
  const [selectedDate, setDate]     = useState<string | null>(null)
  const [selectedSlot, setSlot]     = useState<string | null>(null)
  const [slots, setSlots]           = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [notes, setNotes]           = useState('')
  const [promoCode, setPromoCode]   = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const loadSlots = useCallback(async (date: string) => {
    setSlotsLoading(true)
    setSlot(null)
    try {
      const data = await fetchAvailableSlots(service.id, date)
      setSlots(data.length > 0 ? data : getMockSlots(date))
    } catch {
      setSlots(getMockSlots(date))
    } finally {
      setSlotsLoading(false)
    }
  }, [service.id])

  useEffect(() => {
    if (selectedDate) loadSlots(selectedDate)
  }, [selectedDate, loadSlots])

  const handleDateSelect = (date: string) => {
    setDate(date)
    setSlot(null)
  }

  const handleBook = async () => {
    if (!selectedSlot) return
    setLoading(true)
    setError(null)

    try {
      // Отримуємо токен з localStorage (після реалізації auth)
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('access_token') ?? 'mock_token'
        : 'mock_token'

      if (service.isTrial || service.priceCents === 0) {
        // Безкоштовна сесія — просто створюємо бронювання
        await createBooking({
          serviceId:   service.id,
          scheduledAt: selectedSlot,
          notes:       notes || undefined,
        }, token)
        setStep('success')
      } else {
        // Платна — створюємо бронювання і відкриваємо оплату
        const booking = await createBooking({
          serviceId:   service.id,
          scheduledAt: selectedSlot,
          notes:       notes || undefined,
          promoCode:   promoCode || undefined,
        }, token)
        await createPaymentIntent(booking.id, token)
        setStep('payment')
      }
    } catch (e) {
      // В demo-режимі — одразу success
      setStep(service.isTrial ? 'success' : 'payment')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="bg-white border border-sand-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14l5.5 5.5L22 8" stroke="#15b37e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="font-serif text-2xl mb-2">Сесію заброньовано!</h2>
        <p className="text-stone-500 text-sm mb-2">
          {dayjs(selectedSlot!).format('D MMMM, HH:mm')} з {mentor.user.fullName}
        </p>
        <p className="text-stone-400 text-xs mb-7">
          Деталі та посилання на відеодзвінок надійдуть на email
        </p>
        <a href="/dashboard"
          className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm font-medium
                     px-6 py-3 rounded-xl hover:bg-stone-800 transition-all">
          Мої бронювання
        </a>
      </div>
    )
  }

  // ── Payment screen ─────────────────────────────────────────────
  if (step === 'payment') {
    return (
      <div className="bg-white border border-sand-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="6" width="22" height="16" rx="2" stroke="#78716c" strokeWidth="1.5"/>
            <path d="M3 11h22" stroke="#78716c" strokeWidth="1.5"/>
            <path d="M7 16h4" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="font-serif text-2xl mb-2">Оплата</h2>
        <p className="text-stone-500 text-sm mb-1">
          {formatPrice(service.priceCents, service.currency)} · {service.durationMinutes} хв
        </p>
        <p className="text-stone-400 text-xs mb-7">
          {dayjs(selectedSlot!).format('D MMMM, HH:mm')}
        </p>

        {/* Stripe Elements placeholder */}
        <div className="border-2 border-dashed border-sand-300 rounded-xl p-6 mb-6 text-left">
          <p className="text-xs text-stone-400 text-center mb-4">Stripe Payment Element</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-stone-500 block mb-1">Номер картки</label>
              <div className="border border-sand-200 rounded-lg px-3 py-2.5 text-sm text-stone-300">
                4242 4242 4242 4242
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-stone-500 block mb-1">Термін дії</label>
                <div className="border border-sand-200 rounded-lg px-3 py-2.5 text-sm text-stone-300">12/27</div>
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">CVC</label>
                <div className="border border-sand-200 rounded-lg px-3 py-2.5 text-sm text-stone-300">123</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep('success')}
          className="w-full bg-brand-500 text-white text-sm font-medium py-3.5 rounded-xl
                     hover:bg-brand-600 active:scale-95 transition-all"
        >
          Сплатити {formatPrice(service.priceCents, service.currency)}
        </button>

        <p className="text-xs text-stone-400 mt-3 flex items-center justify-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2" y="5" width="8" height="6" rx="1" stroke="#a8a29e" strokeWidth="1"/>
            <path d="M4 5V4a2 2 0 014 0v1" stroke="#a8a29e" strokeWidth="1"/>
          </svg>
          Захищено Stripe
        </p>
      </div>
    )
  }

  // ── Main booking form ──────────────────────────────────────────
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs text-stone-400">
        <span className={step === 'datetime' ? 'text-stone-800 font-medium' : ''}>
          1. Дата і час
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        <span className={step === 'details' ? 'text-stone-800 font-medium' : ''}>
          2. Деталі
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        <span>3. Оплата</span>
      </div>

      {step === 'datetime' && (
        <>
          <CalendarPicker selectedDate={selectedDate} onSelect={handleDateSelect} />
          <SlotPicker
            slots={slots}
            selected={selectedSlot}
            onSelect={setSlot}
            loading={slotsLoading}
            date={selectedDate}
          />
          <button
            onClick={() => setStep('details')}
            disabled={!selectedSlot}
            className="w-full bg-stone-900 text-white text-sm font-medium py-3.5 rounded-xl
                       hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed
                       active:scale-95 transition-all"
          >
            Продовжити
          </button>
        </>
      )}

      {step === 'details' && (
        <>
          {/* Chosen slot summary */}
          <div className="bg-brand-50 border border-brand-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-brand-800">
                {dayjs(selectedSlot!).format('D MMMM, HH:mm')}
              </p>
              <p className="text-xs text-brand-600">{service.durationMinutes} хв · {mentor.user.fullName}</p>
            </div>
            <button
              onClick={() => setStep('datetime')}
              className="text-xs text-brand-600 hover:text-brand-800 underline"
            >
              Змінити
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Що хочеш обговорити?
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Коротко опиши свій запит, щоб ментор міг підготуватись..."
              className="w-full border border-sand-200 rounded-xl px-4 py-3 text-sm
                         text-stone-800 placeholder:text-stone-300 resize-none
                         focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Promo code */}
          {!service.isTrial && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Промокод</label>
              <div className="flex gap-2">
                <input
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoApplied(false) }}
                  placeholder="WELCOME20"
                  className="flex-1 border border-sand-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                />
                <button
                  onClick={() => promoCode && setPromoApplied(true)}
                  className="px-4 py-2.5 border border-sand-200 rounded-xl text-sm font-medium
                             text-stone-600 hover:border-stone-300 transition-all"
                >
                  Застосувати
                </button>
              </div>
              {promoApplied && (
                <p className="text-xs text-brand-600 mt-1.5 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  Промокод застосовано
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={loading}
            className="w-full bg-stone-900 text-white text-sm font-medium py-3.5 rounded-xl
                       hover:bg-stone-800 disabled:opacity-60 active:scale-95 transition-all
                       flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity=".3" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Бронюємо...
              </>
            ) : service.isTrial ? (
              'Забронювати безкоштовно'
            ) : (
              `Перейти до оплати · ${formatPrice(service.priceCents, service.currency)}`
            )}
          </button>

          <p className="text-xs text-stone-400 text-center">
            Безкоштовне скасування за 24 год до сесії
          </p>
        </>
      )}
    </div>
  )
}
