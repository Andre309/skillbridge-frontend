import type { MentorProfile, Review } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export async function fetchMentorById(id: string): Promise<MentorProfile> {
  const res = await fetch(`${BASE}/mentors/${id}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Ментора не знайдено')
  const json = await res.json()
  return json.data as MentorProfile
}

export async function fetchMentorReviews(
  id: string, page = 1, limit = 6
): Promise<{ data: Review[]; meta: { total: number; totalPages: number; page: number; limit: number } }> {
  const res = await fetch(`${BASE}/mentors/${id}/reviews?page=${page}&limit=${limit}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Не вдалось завантажити відгуки')
  const json = await res.json()
  return { data: json.data ?? [], meta: json.meta ?? { total: 0, totalPages: 0, page: 1, limit } }
}

export function getMockMentor(id: string): MentorProfile {
  return {
    id, userId: 'u1',
    headline:        'Senior UX Designer · ex-Booking.com',
    yearsExperience: 7,
    company:         'Booking.com',
    position:        'Senior UX Designer',
    linkedinUrl:     'https://linkedin.com/in/maria-koval',
    githubUrl:       undefined,
    isFeatured:      true,
    isVerified:      true,
    avgRating:       4.9,
    totalReviews:    41,
    totalSessions:   98,
    languages:       ['uk', 'en'],
    subscriptionPlan: 'pro',
    user: {
      id: 'u1',
      fullName:  'Марія Коваль',
      timezone:  'Europe/Kyiv',
      avatarUrl: undefined,
      bio: 'Senior UX Designer з 7 роками досвіду. Працювала в Booking.com та Grammarly. ' +
           'Спеціалізуюсь на user research, Figma та побудові дизайн-систем з нуля. ' +
           'Допомагаю дизайнерам покращити портфоліо, підготуватись до співбесід та зрости до Senior рівня.',
    },
    services: [
      {
        id: 's1', title: 'Фідбек на UX/UI дизайн',
        description: 'Детальний огляд вашого дизайну з конкретними рекомендаціями. Розберемо UX flows, ієрархію, типографіку і загальний вигляд.',
        durationMinutes: 30, priceCents: 2500, currency: 'USD',
        tags: ['Figma', 'UX Review', 'UI'], isTrial: false, isActive: true,
      },
      {
        id: 's2', title: 'Portfolio Review для дизайнера',
        description: 'Повний аудит вашого портфоліо. Що прибрати, що додати, як презентувати кейси щоб отримати роботу в топ-компанії.',
        durationMinutes: 60, priceCents: 4500, currency: 'USD',
        tags: ['Portfolio', 'Career', 'Hiring'], isTrial: false, isActive: true,
      },
      {
        id: 's3', title: 'Пробна сесія — знайомство',
        description: 'Безкоштовна 15-хвилинна сесія. Познайомимось, розберемо твій запит і вирішимо чи підходимо один одному.',
        durationMinutes: 15, priceCents: 0, currency: 'USD',
        tags: ['Знайомство'], isTrial: true, isActive: true,
      },
    ],
  }
}

export function getMockReviews(): Review[] {
  return [
    {
      id: 'r1', rating: 5,
      comment: 'Марія дала дуже конкретний і структурований фідбек. Зрозуміла мій запит з першої хвилини і одразу перейшла до справи. Рекомендую всім хто хоче прокачати свій UI.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      reviewer: { fullName: 'Андрій Шевченко' },
      mentorReply: 'Дякую за відгук! Було приємно попрацювати.',
    },
    {
      id: 'r2', rating: 5,
      comment: 'За 30 хвилин отримала більше корисних порад ніж за місяць самостійного навчання. Тепер точно знаю в якому напрямку рухатись.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reviewer: { fullName: 'Вікторія Мороз' },
    },
    {
      id: 'r3', rating: 5,
      comment: 'Відмінна сесія по портфоліо. Марія показала як подати кейси більш переконливо і що прибрати. Після змін отримав 3 запрошення на інтерв\'ю за тиждень.',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      reviewer: { fullName: 'Олексій Бондар' },
    },
    {
      id: 'r4', rating: 5,
      comment: 'Дуже добре пояснила принципи дизайн-систем. Тепер набагато краще розумію як організовувати компоненти у Figma.',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      reviewer: { fullName: 'Катерина Лисенко' },
    },
  ]
}
