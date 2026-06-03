'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { authApi, getMockAuthResponse } from '@/lib/auth'

type Field = 'email' | 'password'
type Errors = Partial<Record<Field, string>>

function validate(email: string, password: string): Errors {
  const errors: Errors = {}
  if (!email)                          errors.email    = "Введіть email"
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email  = "Невалідний email"
  if (!password)                       errors.password = "Введіть пароль"
  else if (password.length < 8)        errors.password = "Мінімум 8 символів"
  return errors
}

export default function LoginPage() {
  const router  = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [errors,   setErrors]   = useState<Errors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(email, password)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setApiError(null)
    setLoading(true)

    try {
      const data = await authApi.login({ email, password })
      setAuth(data.user as any, data.accessToken)
      router.push('/dashboard')
    } catch (err) {
      // Demo fallback
      const mock = getMockAuthResponse(email, email.split('@')[0] ?? 'User', 'mentee')
      setAuth(mock.user as any, mock.accessToken)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand-50 flex">

      {/* Left — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-lg mx-auto w-full">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7C2 4.24 4.24 2 7 2s5 2.24 5 5-2.24 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 5v4M5 7h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg">Skill<em className="text-brand-600 not-italic">Bridge</em></span>
        </Link>

        <div className="mb-8">
          <h1 className="font-serif text-3xl tracking-tight mb-2">З поверненням</h1>
          <p className="text-stone-400">Увійди у свій акаунт</p>
        </div>

        {/* OAuth buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Google', icon: (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            )},
            { label: 'GitHub', icon: (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                <path fillRule="evenodd" d="M9 0C4.03 0 0 4.03 0 9c0 3.98 2.58 7.35 6.16 8.54.45.08.61-.2.61-.44v-1.53c-2.5.54-3.03-1.2-3.03-1.2-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.37 2.1.97 2.61.74.08-.58.31-.97.57-1.2-1.99-.22-4.09-1-4.09-4.43 0-.98.35-1.78.93-2.4-.09-.23-.4-1.14.09-2.37 0 0 .76-.24 2.48.93A8.65 8.65 0 019 4.37c.77 0 1.54.1 2.26.3 1.72-1.17 2.48-.93 2.48-.93.49 1.23.18 2.14.09 2.37.58.62.93 1.42.93 2.4 0 3.44-2.1 4.2-4.1 4.42.32.28.61.82.61 1.66v2.46c0 .24.16.52.62.44A9.01 9.01 0 0018 9c0-4.97-4.03-9-9-9z" clipRule="evenodd"/>
              </svg>
            )},
          ].map(provider => (
            <button key={provider.label}
              className="flex items-center justify-center gap-2.5 bg-white border border-sand-200
                         rounded-xl py-3 text-sm font-medium text-stone-700
                         hover:border-stone-300 hover:bg-sand-50 transition-all">
              {provider.icon}
              {provider.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="relative flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-sand-200" />
          <span className="text-xs text-stone-400">або через email</span>
          <div className="flex-1 h-px bg-sand-200" />
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full border rounded-xl px-4 py-3 text-sm placeholder:text-stone-300
                          focus:outline-none focus:ring-2 transition-all
                          ${errors.email
                            ? 'border-red-300 focus:border-red-300 focus:ring-red-100'
                            : 'border-sand-200 focus:border-brand-300 focus:ring-brand-100'}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-stone-700">Пароль</label>
              <Link href="/auth/forgot-password"
                className="text-xs text-brand-600 hover:text-brand-800 transition-colors">
                Забув пароль?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Мінімум 8 символів"
                className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm placeholder:text-stone-300
                            focus:outline-none focus:ring-2 transition-all
                            ${errors.password
                              ? 'border-red-300 focus:border-red-300 focus:ring-red-100'
                              : 'border-sand-200 focus:border-brand-300 focus:ring-brand-100'}`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 9s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/>
                    <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M3 3l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 9s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/>
                    <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full bg-stone-900 text-white text-sm font-medium py-3.5 rounded-xl
                       hover:bg-stone-800 disabled:opacity-60 active:scale-95 transition-all
                       flex items-center justify-center gap-2 mt-2">
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity=".3" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Входимо...
              </>
            ) : 'Увійти'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-400 mt-6">
          Немає акаунту?{' '}
          <Link href="/auth/register" className="text-brand-600 font-medium hover:text-brand-800 transition-colors">
            Зареєструватись
          </Link>
        </p>
      </div>

      {/* Right — decorative panel */}
      <div className="hidden lg:flex flex-1 bg-stone-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-brand-400/15 blur-3xl" />
        </div>
        <div className="relative z-10 text-white text-center px-12 max-w-sm">
          <p className="font-serif text-4xl leading-tight mb-5">
            "Одна сесія змінила напрямок моєї кар'єри"
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center text-sm font-medium">
              АШ
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Андрій Шевченко</p>
              <p className="text-xs text-stone-400">Frontend Developer</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}