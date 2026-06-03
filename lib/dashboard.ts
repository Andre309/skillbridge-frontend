import type { Booking, Review } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

async function authGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message)
  return json.data as T
}

export const dashboardApi = {
  getBookings: (role: 'mentee' | 'mentor', token: string, status?: string) =>
    authGet<Booking[]>(`/bookings?role=${role}${status ? `&status=${status}` : ''}&limit=20`, token),

  cancelBooking: async (id: string, token: string) => {
    const res = await fetch(`${BASE}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    })
    return res.json()
  },
}

// ── Mock data ────────────────────────────────────────────────
const now = new Date()
const future = (days: number, h = 14) =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, h, 0).toISOString()
const past = (days: number, h = 11) =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() - days, h, 0).toISOString()

export const MOCK_MENTEE_BOOKINGS: Booking[] = [
  {
    id: 'b1', status: 'confirmed', scheduledAt: future(2),
    durationMinutes: 30, priceCents: 2500, currency: 'USD',
    service: { title: 'Фідбек на UX/UI дизайн', durationMinutes: 30 },
    mentor:  { user: { fullName: 'Марія Коваль' } },
    mentee:  { id: 'u1', fullName: 'Тестовий Менті' },
  },
  {
    id: 'b2', status: 'confirmed', scheduledAt: future(5),
    durationMinutes: 60, priceCents: 4500, currency: 'USD',
    service: { title: 'Portfolio Review', durationMinutes: 60 },
    mentor:  { user: { fullName: 'Дмитро Петренко' } },
    mentee:  { id: 'u1', fullName: 'Тестовий Менті' },
  },
  {
    id: 'b3', status: 'completed', scheduledAt: past(3),
    durationMinutes: 30, priceCents: 3500, currency: 'USD',
    service: { title: 'Code Review · Node.js', durationMinutes: 30 },
    mentor:  { user: { fullName: 'Дмитро Петренко' } },
    mentee:  { id: 'u1', fullName: 'Тестовий Менті' },
    review:  { rating: 5 },
  },
  {
    id: 'b4', status: 'completed', scheduledAt: past(8),
    durationMinutes: 60, priceCents: 7000, currency: 'USD',
    service: { title: 'Product Strategy Review', durationMinutes: 60 },
    mentor:  { user: { fullName: 'Олена Савченко' } },
    mentee:  { id: 'u1', fullName: 'Тестовий Менті' },
    review:  { rating: 5 },
  },
  {
    id: 'b5', status: 'cancelled', scheduledAt: past(1),
    durationMinutes: 30, priceCents: 2500, currency: 'USD',
    service: { title: 'UX Консультація', durationMinutes: 30 },
    mentor:  { user: { fullName: 'Марія Коваль' } },
    mentee:  { id: 'u1', fullName: 'Тестовий Менті' },
  },
]

export const MOCK_MENTOR_BOOKINGS: Booking[] = [
  {
    id: 'm1', status: 'confirmed', scheduledAt: future(1, 10),
    durationMinutes: 30, priceCents: 2500, currency: 'USD',
    service: { title: 'Фідбек на UX/UI дизайн', durationMinutes: 30 },
    mentor:  { user: { fullName: 'Марія Коваль' } },
    mentee:  { id: 'u2', fullName: 'Андрій Шевченко' },
  },
  {
    id: 'm2', status: 'confirmed', scheduledAt: future(1, 14),
    durationMinutes: 60, priceCents: 4500, currency: 'USD',
    service: { title: 'Portfolio Review', durationMinutes: 60 },
    mentor:  { user: { fullName: 'Марія Коваль' } },
    mentee:  { id: 'u3', fullName: 'Вікторія Гнатюк' },
  },
  {
    id: 'm3', status: 'confirmed', scheduledAt: future(3, 11),
    durationMinutes: 30, priceCents: 2500, currency: 'USD',
    service: { title: 'Фідбек на UX/UI дизайн', durationMinutes: 30 },
    mentor:  { user: { fullName: 'Марія Коваль' } },
    mentee:  { id: 'u4', fullName: 'Олексій Бондар' },
  },
  {
    id: 'm4', status: 'completed', scheduledAt: past(2, 15),
    durationMinutes: 30, priceCents: 2500, currency: 'USD',
    service: { title: 'Фідбек на UX/UI дизайн', durationMinutes: 30 },
    mentor:  { user: { fullName: 'Марія Коваль' } },
    mentee:  { id: 'u5', fullName: 'Катерина Лисенко' },
    review:  { rating: 5 },
  },
  {
    id: 'm5', status: 'completed', scheduledAt: past(5, 13),
    durationMinutes: 60, priceCents: 4500, currency: 'USD',
    service: { title: 'Portfolio Review', durationMinutes: 60 },
    mentor:  { user: { fullName: 'Марія Коваль' } },
    mentee:  { id: 'u6', fullName: 'Роман Мороз' },
    review:  { rating: 5 },
  },
]
