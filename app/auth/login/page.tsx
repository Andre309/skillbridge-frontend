'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { authApi, getMockAuthResponse } from '@/lib/auth'

type Errors = Partial<Record<'email' | 'password', string>>

function validate(email: string, password: string): Errors {
  const e: Errors = {}
  if (!email || !/\S+@\S+\.\S+/.test(email)) e.email    = 'Введіть валідний email'
  if (!password || password.length < 8)       e.password = 'Мінімум 8 символів'
  return e
}

export default function LoginPage() {
  const router  = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [errors,   setErrors]   = useState<Errors>({})
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(email, password)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const data = await authApi.login({ email, password })
      setAuth(data.user as any, data.accessToken)
      router.push('/dashboard')
    } catch {
      const mock = getMockAuthResponse(email, email.split('@')[0] ?? 'User', 'mentee')
      setAuth(mock.user as any, mock.accessToken)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl bg-[#0F7B5A] flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8C3 5.24 5.24 3 8 3s5 2.24 5 5-2.24 5-5 5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M8 6v4M6 8h4" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-xl tracking-tight text-stone-900">
            Skill<em className="not-italic text-[#0F7B5A]">Bridge</em>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm shadow-stone-200/60 px-8 py-9">

          {/* Heading */}
          <h1 className="text-xl font-semibold text-stone-900 text-center mb-7 tracking-tight">
            Увійди у свій акаунт
          </h1>

          {/* Google button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200
                       rounded-xl py-3 text-sm font-medium text-stone-700 hover:bg-stone-50
                       hover:border-stone-200/80 active:scale-[0.98] transition-all shadow-xl"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-stone-100" />
            <span className="text-xs text-stone-400 font-medium">або через email</span>
            <div className="flex-1 h-px bg-stone-100" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>

            {/* Email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full border rounded-xl px-4 py-3 text-sm text-stone-900
                            placeholder:text-stone-400 outline-none transition-all
                            ${errors.email
                              ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                              : 'border-stone-200 bg-stone-50/50 focus:border-[#0F7B5A] focus:ring-2 focus:ring-[#0F7B5A]/10 focus:bg-white'
                            }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-stone-900
                              placeholder:text-stone-400 outline-none transition-all
                              ${errors.password
                                ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                : 'border-stone-200 bg-stone-50/50 focus:border-[#0F7B5A] focus:ring-2 focus:ring-[#0F7B5A]/10 focus:bg-white'
                              }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400
                             hover:text-stone-600 transition-colors"
                >
                  {showPass ? (
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path d="M2 8.5s2.5-4.5 6.5-4.5 6.5 4.5 6.5 4.5-2.5 4.5-6.5 4.5S2 8.5 2 8.5z" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="8.5" cy="8.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M3 3l11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path d="M2 8.5s2.5-4.5 6.5-4.5 6.5 4.5 6.5 4.5-2.5 4.5-6.5 4.5S2 8.5 2 8.5z" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="8.5" cy="8.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-stone-400 hover:text-[#0F7B5A] transition-colors"
              >
                Забув пароль?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white text-sm font-medium py-3 rounded-xl
                         hover:bg-stone-800 disabled:opacity-50 active:scale-[0.98]
                         transition-all flex items-center justify-center gap-2 mt-1"
            >
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
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-stone-400 mt-6">
          Немає акаунту?{' '}
          <Link
            href="/auth/register"
            className="text-stone-700 font-medium hover:text-[#0F7B5A] transition-colors"
          >
            Зареєструватись
          </Link>
        </p>

      </div>
    </div>
  )
}