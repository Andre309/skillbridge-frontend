export interface User {
  id: string
  email: string
  fullName: string
  displayName?: string
  avatarUrl?: string
  role: 'mentee' | 'mentor' | 'both' | 'admin'
  timezone: string
  bio?: string
  mentorProfile?: { id: string; subscriptionPlan: string; isVerified: boolean }
}

export interface MentorProfile {
  id: string
  userId: string
  headline?: string
  yearsExperience?: number
  company?: string
  position?: string
  linkedinUrl?: string
  githubUrl?: string
  websiteUrl?: string
  isFeatured: boolean
  isVerified: boolean
  avgRating?: number
  totalReviews: number
  totalSessions: number
  languages: string[]
  subscriptionPlan: 'starter' | 'pro' | 'business'
  user: { id: string; fullName: string; avatarUrl?: string; timezone: string; bio?: string }
  services: Service[]
}

export interface Service {
  id: string
  title: string
  description?: string
  durationMinutes: number
  priceCents: number
  currency: string
  tags: string[]
  isTrial: boolean
  isActive: boolean
  category?: Category
}

export interface Category {
  id: string
  slug: string
  name: string
  icon?: string
  children?: Category[]
}

export interface Review {
  id: string
  rating: number
  comment?: string
  mentorReply?: string
  createdAt: string
  reviewer: { fullName: string; avatarUrl?: string }
}

export interface Booking {
  id: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  scheduledAt: string
  durationMinutes: number
  priceCents: number
  currency: string
  service: { title: string; durationMinutes: number }
  mentor: { user: { fullName: string; avatarUrl?: string } }
  mentee: { id: string; fullName: string; avatarUrl?: string }
  review?: { rating: number }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}
