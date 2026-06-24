import type { MentorProfile, Service } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

async function authRequest<T>(path: string, method: string, token: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message ?? 'Помилка запиту')
  return json.data as T
}

export const mentorProfileApi = {
  getMyProfile: (token: string) =>
    authRequest<MentorProfile>('/mentors/me/profile', 'GET', token),

  updateProfile: (token: string, data: Record<string, unknown>) =>
    authRequest<MentorProfile>('/mentors/me/profile', 'PUT', token, data),

  getServices: (mentorId: string, token: string) =>
    authRequest<Service[]>(`/services/mentor/${mentorId}`, 'GET', token),

  createService: (token: string, data: Record<string, unknown>) =>
    authRequest<Service>('/services', 'POST', token, data),

  updateService: (token: string, id: string, data: Record<string, unknown>) =>
    authRequest<Service>(`/services/${id}`, 'PUT', token, data),

  deleteService: (token: string, id: string) =>
    authRequest<void>(`/services/${id}`, 'DELETE', token),
}

export const MOCK_MENTOR_PROFILE: MentorProfile = {
  id: 'm1',
  userId: 'u1',
  headline: 'Senior UX Designer · ex-Booking.com',
  yearsExperience: 7,
  company: 'Booking.com',
  position: 'Senior UX Designer',
  linkedinUrl: 'https://linkedin.com/in/maria-koval',
  githubUrl: '',
  websiteUrl: '',
  isFeatured: true,
  isVerified: true,
  avgRating: 4.9,
  totalReviews: 41,
  totalSessions: 98,
  languages: ['uk', 'en'],
  subscriptionPlan: 'pro',
  user: {
    id: 'u1',
    fullName: 'Марія Коваль',
    timezone: 'Europe/Kyiv',
    bio: 'Senior UX Designer з 7 роками досвіду. Працювала в Booking.com та Grammarly.',
  },
  services: [],
}

export const MOCK_SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Фідбек на UX/UI дизайн',
    description: 'Детальний огляд вашого дизайну з конкретними рекомендаціями.',
    durationMinutes: 30,
    priceCents: 2500,
    currency: 'USD',
    tags: ['Figma', 'UX Review', 'UI'],
    isTrial: false,
    isActive: true,
  },
  {
    id: 's2',
    title: 'Portfolio Review',
    description: 'Повний аудит портфоліо.',
    durationMinutes: 60,
    priceCents: 4500,
    currency: 'USD',
    tags: ['Portfolio', 'Career'],
    isTrial: false,
    isActive: true,
  },
]