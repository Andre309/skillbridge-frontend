import React from 'react'
import type { Metadata } from 'next'

import Header           from '@/components/layout/Header'
import Footer           from '@/components/layout/Footer'
import Hero             from '@/components/sections/Hero'
import Marquee          from '@/components/sections/Marquee'
import Categories       from '@/components/sections/Categories'
import FeaturedMentors  from '@/components/sections/FeaturedMentors'
import HowItWorks       from '@/components/sections/HowItWorks'
import Pricing          from '@/components/sections/Pricing'
import Testimonials     from '@/components/sections/Testimonials'
import CTA              from '@/components/sections/CTA'

export const metadata: Metadata = {
  title:       'SkillBridge — Мікро-менторство',
  description: 'Знайди фахівця за 15 хвилин. Маркетплейс мікро-менторства з реальними експертами у розробці, дизайні, продукті та бізнесі.',
}

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* 1. Hero — головний блок з карткою менторів */}
        <Hero />

        {/* 2. Marquee — рядок категорій що рухається */}
        <Marquee />

        {/* 3. Категорії */}
        <Categories />

        {/* 4. Топ ментори тижня */}
        <FeaturedMentors />

        {/* 5. Як це працює */}
        <HowItWorks />

        {/* 6. Тарифи для менторів */}
        <Pricing />

        {/* 7. Відгуки */}
        <Testimonials />

        {/* 8. Фінальний CTA */}
        <CTA />
      </main>

      <Footer />
    </>
  )
}
