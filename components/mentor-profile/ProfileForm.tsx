'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import type { MentorProfile } from '@/types'

const LANGUAGES = [
  { code: 'uk', label: 'Українська' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pl', label: 'Polski' },
  { code: 'fr', label: 'Français' },
]

interface ProfileFormProps {
  profile:  MentorProfile
  onSave:   (data: Record<string, unknown>) => Promise<void>
}

export default function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [form, setForm] = useState({
    headline:        profile.headline ?? '',
    yearsExperience: profile.yearsExperience ?? 0,
    company:         profile.company ?? '',
    position:        profile.position ?? '',
    linkedinUrl:     profile.linkedinUrl ?? '',
    githubUrl:       profile.githubUrl ?? '',
    websiteUrl:      profile.websiteUrl ?? '',
    languages:       profile.languages ?? [],
    bio:             profile.user.bio ?? '',
  })
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const set = (key: string, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const toggleLang = (code: string) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(code)
        ? prev.languages.filter(l => l !== code)
        : [...prev.languages, code],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Помилка збереження')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white border border-sand-200 rounded-2xl p-7 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">Основна інформація</h2>
        {saved && (
          <span className="text-xs text-brand-600 bg-brand-50 border border-brand-200
                           px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Збережено
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Headline */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Заголовок профілю
          </label>
          <input
            value={form.headline}
            onChange={e => set('headline', e.target.value)}
            placeholder="Senior UX Designer · ex-Booking.com"
            className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
          <p className="text-xs text-stone-400 mt-1">Відображається під вашим іменем у пошуку</p>
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Компанія</label>
          <input
            value={form.company}
            onChange={e => set('company', e.target.value)}
            placeholder="Google, Booking.com..."
            className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Посада</label>
          <input
            value={form.position}
            onChange={e => set('position', e.target.value)}
            placeholder="Senior Engineer, Product Manager..."
            className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {/* Years */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Років досвіду</label>
          <input
            type="number"
            min={0}
            max={50}
            value={form.yearsExperience}
            onChange={e => set('yearsExperience', Number(e.target.value))}
            className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">LinkedIn URL</label>
          <input
            value={form.linkedinUrl}
            onChange={e => set('linkedinUrl', e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">GitHub URL</label>
          <input
            value={form.githubUrl}
            onChange={e => set('githubUrl', e.target.value)}
            placeholder="https://github.com/..."
            className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Вебсайт</label>
          <input
            value={form.websiteUrl}
            onChange={e => set('websiteUrl', e.target.value)}
            placeholder="https://..."
            className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {/* Bio */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Про себе</label>
          <textarea
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
            rows={4}
            placeholder="Розкажи про свій досвід, спеціалізацію і чим можеш допомогти..."
            className="w-full border border-sand-200 rounded-xl px-4 py-3 text-sm resize-none
                       focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
          <p className="text-xs text-stone-400 mt-1">{form.bio.length} / 500 символів</p>
        </div>

        {/* Languages */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-2">Мови</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => toggleLang(lang.code)}
                className={cn(
                  'text-sm px-4 py-2 rounded-xl border font-medium transition-all',
                  form.languages.includes(lang.code)
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'border-sand-200 text-stone-600 hover:border-stone-300'
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-stone-900 text-white text-sm font-medium
                   px-6 py-3 rounded-xl hover:bg-stone-800 disabled:opacity-60
                   active:scale-95 transition-all"
      >
        {saving ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity=".3" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            Зберігаємо...
          </>
        ) : 'Зберегти зміни'}
      </button>
    </div>
  )
}