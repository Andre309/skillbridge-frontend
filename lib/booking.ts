import type { Service, MentorProfile } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export async function fetchServiceById(serviceId: string): Promise<Service & { mentor: MentorProfile }> {
  const res = await fetch(`${BASE}/services/${serviceId}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Сервіс не знайдено')
  const json = await res.json()
  return json.data
}

export async function fetchAvailableSlots(serviceId: string, date: string): Promise<string[]> {
  const res = await fetch(
    `${BASE}/availability/slots?serviceId=${serviceId}&date=${date}`,
    { cache: 'no-store' }
  )
  if (!res.ok) return []
  const json = await res.json()
  return json.data ?? []
}

export async function createBooking(body: {
  serviceId:   string
  scheduledAt: string
  notes?:      string
  promoCode?:  string
}, token: string) {
  const res = await fetch(`${BASE}/bookings`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body:    JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message ?? 'Помилка бронювання')
  return json.data
}

export async function createPaymentIntent(bookingId: string, token: string) {
  const res = await fetch(`${BASE}/payments/booking/${bookingId}/payment-intent`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message ?? 'Помилка оплати')
  return json.data as { clientSecret: string; paymentIntentId: string }
}

// Mock дані
export function getMockServiceWithMentor(serviceId: string): Service & { mentor: MentorProfile } {
  const mentor: MentorProfile = {
    id: 'm1', userId: 'u1',
    headline: 'Senior UX Designer · ex-Booking.com',
    yearsExperience: 7, company: 'Booking.com', position: 'Senior UX Designer',
    isFeatured: true, isVerified: true,
    avgRating: 4.9, totalReviews: 41, totalSessions: 98,
    languages: ['uk', 'en'], subscriptionPlan: 'pro',
    user: { id: 'u1', fullName: 'Марія Коваль', timezone: 'Europe/Kyiv',
            bio: 'Senior UX Designer з 7 роками досвіду.' },
    services: [],
  }

  const services: Record<string, Service> = {
    's1': {
      id: 's1', title: 'Фідбек на UX/UI дизайн',
      description: 'Детальний огляд вашого дизайну з конкретними рекомендаціями. Розберемо UX flows, ієрархію та загальний вигляд.',
      durationMinutes: 30, priceCents: 2500, currency: 'USD',
      tags: ['Figma', 'UX Review', 'UI'], isTrial: false, isActive: true,
    },
    's2': {
      id: 's2', title: 'Portfolio Review для дизайнера',
      description: 'Повний аудит портфоліо. Що прибрати, що додати і як презентувати кейси.',
      durationMinutes: 60, priceCents: 4500, currency: 'USD',
      tags: ['Portfolio', 'Career'], isTrial: false, isActive: true,
    },
    's3': {
      id: 's3', title: 'Пробна сесія — знайомство',
      description: 'Безкоштовна 15-хвилинна сесія. Познайомимось і вирішимо чи підходимо один одному.',
      durationMinutes: 15, priceCents: 0, currency: 'USD',
      tags: ['Знайомство'], isTrial: true, isActive: true,
    },
  }

  return { ...(services[serviceId] ?? services['s1']!), mentor }
}

export function getMockSlots(date: string): string[] {
  const slots: string[] = []
  const hours = [9, 10, 11, 13, 14, 15, 16, 17]
  for (const h of hours) {
    slots.push(new Date(`${date}T${String(h).padStart(2,'0')}:00:00.000Z`).toISOString())
    if (h < 17) slots.push(new Date(`${date}T${String(h).padStart(2,'0')}:30:00.000Z`).toISOString())
  }
  return slots
}