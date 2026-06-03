import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MentorProfileHeader from '@/components/mentor/MentorProfileHeader'
import ServiceCard from '@/components/mentor/ServiceCard'
import ReviewsList from '@/components/mentor/ReviewsList'
import { fetchMentorById, fetchMentorReviews, getMockMentor, getMockReviews } from '@/lib/mentor'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const mentor = await fetchMentorById(params.id)
    return {
      title:       `${mentor.user.fullName} — ментор`,
      description: mentor.headline ?? `Забронюй сесію з ${mentor.user.fullName}`,
    }
  } catch {
    return { title: 'Профіль ментора' }
  }
}

export default async function MentorProfilePage({ params }: PageProps) {
    type Mentor = Awaited<ReturnType<typeof fetchMentorById>>
    type ReviewsData = Awaited<ReturnType<typeof fetchMentorReviews>>
  
    let mentor: Mentor
    let reviewsData: ReviewsData

  try {
    [mentor, reviewsData] = await Promise.all([
      fetchMentorById(params.id),
      fetchMentorReviews(params.id),
    ])
  } catch {
    // Fallback до mock якщо API недоступний
    try {
      mentor      = getMockMentor(params.id)
      reviewsData = { data: getMockReviews(), meta: { total: 4, totalPages: 1, page: 1, limit: 6 } }
    } catch {
      notFound()
    }
  }

  const trialService   = mentor.services.find(s => s.isTrial)
  const regularServices = mentor.services.filter(s => !s.isTrial && s.isActive)

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-stone-400 mb-6">
            <a href="/mentors" className="hover:text-stone-700 transition-colors">Ментори</a>
            <span>/</span>
            <span className="text-stone-700">{mentor.user.fullName}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left — main content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Profile header */}
              <MentorProfileHeader mentor={mentor} />

              {/* Services */}
              <section>
                <h2 className="font-serif text-2xl tracking-tight mb-4">Послуги</h2>

                {/* Trial first */}
                {trialService && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-brand-600 uppercase tracking-wider mb-3">
                      Спробуй безкоштовно
                    </p>
                    <ServiceCard service={trialService} mentorId={mentor.id} />
                  </div>
                )}

                {/* Regular services */}
                {regularServices.length > 0 && (
                  <div>
                    {trialService && (
                      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">
                        Платні сесії
                      </p>
                    )}
                    <div className="space-y-4">
                      {regularServices.map(s => (
                        <ServiceCard key={s.id} service={s} mentorId={mentor.id} />
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Reviews */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-2xl tracking-tight">Відгуки</h2>
                  <span className="text-sm text-stone-400">{reviewsData.meta.total} всього</span>
                </div>
                <ReviewsList
                  reviews={reviewsData.data}
                  total={reviewsData.meta.total}
                  avgRating={mentor.avgRating}
                />
              </section>
            </div>

            {/* Right — sticky sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-4">

                {/* Quick book card */}
                <div className="bg-white border border-sand-200 rounded-2xl p-5">
                  <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-4">
                    Швидке бронювання
                  </p>

                  {mentor.services.filter(s => s.isActive).slice(0, 3).map(s => (
                    <a
                      key={s.id}
                      href={`/book/${s.id}?mentor=${mentor.id}`}
                      className="flex items-center justify-between p-3 rounded-xl
                                 hover:bg-sand-50 transition-colors group mb-2 last:mb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-stone-800 group-hover:text-brand-700 transition-colors">
                          {s.durationMinutes} хв
                        </p>
                        <p className="text-xs text-stone-400 truncate max-w-[140px]">{s.title}</p>
                      </div>
                      <span className="text-sm font-medium text-brand-600">
                        {s.isTrial ? 'Free' : `$${(s.priceCents / 100).toFixed(0)}`}
                      </span>
                    </a>
                  ))}

                  <a
                    href={`/book/${mentor.services[0]?.id}?mentor=${mentor.id}`}
                    className="mt-4 w-full block text-center bg-stone-900 text-white text-sm
                               font-medium py-3.5 rounded-xl hover:bg-stone-800 transition-all active:scale-95"
                  >
                    Забронювати сесію
                  </a>
                </div>

                {/* Stats card */}
                <div className="bg-white border border-sand-200 rounded-2xl p-5 space-y-4">
                  <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Статистика
                  </p>
                  {[
                    { label: 'Сесій проведено', value: mentor.totalSessions },
                    { label: 'Відгуків',         value: mentor.totalReviews },
                    { label: 'Років досвіду',    value: mentor.yearsExperience ?? '—' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-sm text-stone-500">{stat.label}</span>
                      <span className="text-sm font-medium text-stone-900">{stat.value}</span>
                    </div>
                  ))}
                  {mentor.avgRating && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-500">Рейтинг</span>
                      <span className="text-sm font-medium text-amber-600">
                        {mentor.avgRating.toFixed(1)} / 5.0
                      </span>
                    </div>
                  )}
                </div>

                {/* Report link */}
                <p className="text-center text-xs text-stone-300 hover:text-stone-500 cursor-pointer transition-colors">
                  Поскаржитись на профіль
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
