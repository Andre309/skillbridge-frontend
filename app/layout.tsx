import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       { default: 'SkillBridge — Мікро-менторство', template: '%s | SkillBridge' },
  description: 'Знайди фахівця за 15 хвилин. Маркетплейс мікро-менторства з реальними експертами.',
  keywords:    ['ментор', 'менторство', 'консультація', 'фахівець', 'skillbridge'],
  openGraph: {
    type:        'website',
    locale:      'uk_UA',
    siteName:    'SkillBridge',
    title:       'SkillBridge — Мікро-менторство',
    description: 'Знайди фахівця за 15 хвилин.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}