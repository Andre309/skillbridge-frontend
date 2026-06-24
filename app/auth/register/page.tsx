'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { authApi, getMockAuthResponse } from '@/lib/auth'
import { cn } from '@/lib/utils'

type Step = 'role' | 'credentials'
type Role = 'mentee' | 'mentor' | 'both'
type Errors = Partial<Record<'fullName' | 'email' | 'password' | 'confirm', string>>

function validate(fullName: string, email: string, password: string, confirm: string): Errors {
  const e: Errors = {}
  if (!fullName || fullName.trim().length < 2) e.fullName = "Мінімум 2 символи"
  if (!email || !/\S+@\S+\.\S+/.test(email))   e.email    = "Введіть валідний email"
  if (!password || password.length < 8)         e.password = "Мінімум 8 символів"
  if (password !== confirm)                     e.confirm  = "Паролі не збігаються"
  return e
}

const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: 'mentee', label: 'Шукаю ментора',  desc: 'Хочу отримати фідбек або пораду від фахівця' },
  { value: 'mentor', label: 'Стати ментором', desc: 'Хочу ділитись досвідом і заробляти на знаннях' },
  { value: 'both',   label: 'І те, і інше',   desc: 'Буду і шукати менторів, і ділитись досвідом' },
]

const inputCls = (hasError: boolean, extra = '') =>
  cn(
    'w-full border rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all',
    hasError
      ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-stone-200 bg-stone-50/50 focus:border-[#0F7B5A] focus:ring-2 focus:ring-[#0F7B5A]/10 focus:bg-white',
    extra
  )

export default function RegisterPage() {
  const router  = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)

  const [step,     setStep]     = useState<Step>('role')
  const [role,     setRole]     = useState<Role>('mentee')
  const [fullName, setFullName] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPass, setShowPass] = useState(false)
  const [errors,   setErrors]   = useState<Errors>({})
  const [loading,  setLoading]  = useState(false)

  const tz = typeof window !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : 'UTC'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(fullName, email, password, confirm)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const data = await authApi.register({ email, password, fullName, role, timezone: tz, locale: 'uk' })
      setAuth(data.user as any, data.accessToken)
      router.push(role === 'mentee' ? '/mentors' : '/mentor/profile')
    } catch {
      const mock = getMockAuthResponse(email, fullName, role)
      setAuth(mock.user as any, mock.accessToken)
      router.push(role === 'mentee' ? '/mentors' : '/mentor/profile')
    } finally {
      setLoading(false)
    }
  }

  const strengthPct = Math.min(100, (password.length / 12) * 100)
  const strengthColor =
    password.length === 0 ? 'bg-stone-100' :
    password.length < 6   ? 'bg-red-400' :
    password.length < 10  ? 'bg-amber-400' :
    'bg-[#0F7B5A]'

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4 py-12">
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
        <div className="bg-white rounded-2xl border border-stone-300 shadow-xl shadow-stone-200/60 px-8 py-9">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-7">
            {(['role', 'credentials'] as Step[]).map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-1.5">
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                    step === s              ? 'bg-stone-900 text-white' :
                    i < (['role','credentials'] as Step[]).indexOf(step)
                                           ? 'bg-[#0F7B5A] text-white' :
                    'bg-stone-100 text-stone-400'
                  )}>
                    {i < (['role','credentials'] as Step[]).indexOf(step) ? '✓' : i + 1}
                  </div>
                  <span className={cn(
                    'text-xs font-medium',
                    step === s ? 'text-stone-800' : 'text-stone-400'
                  )}>
                    {s === 'role' ? 'Роль' : 'Акаунт'}
                  </span>
                </div>
                {i < 1 && <div className="flex-1 h-px bg-stone-100" />}
              </React.Fragment>
            ))}
          </div>

          {/* ── Step 1: Role ── */}
          {step === 'role' && (
            <>
              <h1 className="text-xl font-semibold text-stone-900 text-center mb-6 tracking-tight">
                Хто ти?
              </h1>

              <div className="space-y-3 mb-7">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={cn(
                      'w-full flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all duration-200',
                      role === r.value
                        ? 'border-stone-900 bg-stone-900 shadow-lg shadow-stone-900/20 scale-[1.01]'
                        : 'border-stone-200 bg-white shadow-md shadow-stone-100 hover:border-stone-400 hover:shadow-lg hover:shadow-stone-200/80 hover:scale-[1.01]'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
                      role === r.value ? 'border-white' : 'border-stone-300'
                    )}>
                      {role === r.value && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className={cn(
                        'text-sm font-medium mb-0.5',
                        role === r.value ? 'text-white' : 'text-stone-800'
                      )}>
                        {r.label}
                      </p>
                      <p className={cn(
                        'text-xs leading-relaxed',
                        role === r.value ? 'text-stone-300' : 'text-stone-400'
                      )}>
                        {r.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep('credentials')}
                className="w-full bg-stone-900 text-white text-sm font-medium py-3 rounded-xl
                           hover:bg-stone-800 active:scale-[0.98] transition-all"
              >
                Продовжити
              </button>
            </>
          )}

          {/* ── Step 2: Credentials ── */}
          {step === 'credentials' && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setStep('role')}
                  className="text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M11 14L6 9l5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <h1 className="text-xl font-semibold text-stone-900 tracking-tight">
                  Створи акаунт
                </h1>
              </div>

              {/* Google */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200
                           rounded-xl py-3 text-sm font-medium text-stone-700 hover:bg-stone-50
                           hover:border-stone-300 active:scale-[0.98] transition-all shadow-sm mb-5"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Зареєструватись через Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-stone-100" />
                <span className="text-xs text-stone-400 font-medium">або через email</span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>

                {/* Full name */}
                <div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Повне ім'я"
                    className={inputCls(!!errors.fullName)}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    className={inputCls(!!errors.email)}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Пароль"
                      className={inputCls(!!errors.password, 'pr-11')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M2 8.5s2.5-4.5 6.5-4.5 6.5 4.5 6.5 4.5-2.5 4.5-6.5 4.5S2 8.5 2 8.5z" stroke="currentColor" strokeWidth="1.2"/>
                        <circle cx="8.5" cy="8.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                    </button>
                  </div>
                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="mt-1.5 h-1 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', strengthColor)}
                        style={{ width: `${strengthPct}%` }}
                      />
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.password}</p>}
                </div>

                {/* Confirm */}
                <div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Підтвердження паролю"
                    className={inputCls(!!errors.confirm)}
                  />
                  {errors.confirm && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.confirm}</p>}
                  {confirm && confirm === password && !errors.confirm && (
                    <p className="text-xs text-[#0F7B5A] mt-1.5 ml-1 flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M1.5 5.5l3 3 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      Паролі збігаються
                    </p>
                  )}
                </div>

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
                      Реєструємось...
                    </>
                  ) : 'Створити акаунт'}
                </button>

                <p className="text-xs text-stone-400 text-center pt-1">
                  Реєструючись, ти погоджуєшся з{' '}
                  <Link href="/terms" className="underline hover:text-stone-600">умовами</Link>
                  {' '}та{' '}
                  <Link href="/privacy" className="underline hover:text-stone-600">конфіденційністю</Link>
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-stone-400 mt-6">
          Вже є акаунт?{' '}
          <Link href="/auth/login"
            className="text-stone-700 font-medium hover:text-[#0F7B5A] transition-colors">
            Увійти
          </Link>
        </p>

      </div>
    </div>
  )
}
