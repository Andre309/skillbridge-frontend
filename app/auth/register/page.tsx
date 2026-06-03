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
  if (!fullName || fullName.trim().length < 2) e.fullName = "Введіть повне ім'я (мін. 2 символи)"
  if (!email || !/\S+@\S+\.\S+/.test(email))   e.email    = "Введіть валідний email"
  if (!password || password.length < 8)        e.password = "Мінімум 8 символів"
  if (password !== confirm)                    e.confirm  = "Паролі не збігаються"
  return e
}

const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: 'mentee', label: 'Шукаю ментора',  desc: 'Хочу отримати фідбек, пораду або допомогу від фахівця'},
  { value: 'mentor', label: 'Стати ментором', desc: 'Хочу ділитись досвідом і заробляти на своїх знаннях'},
  { value: 'both',   label: 'І те, і інше',   desc: 'Буду і шукати менторів, і сам ділитись досвідом'},
]

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
  const [apiError, setApiError] = useState<string | null>(null)

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(fullName, email, password, confirm)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setApiError(null)
    setLoading(true)

    try {
      const data = await authApi.register({
        email, password, fullName, role,
        timezone: tz, locale: 'uk',
      })
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

  return (
    <div className="min-h-screen bg-sand-50 flex">

      {/* Left — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-lg mx-auto w-full">

        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7C2 4.24 4.24 2 7 2s5 2.24 5 5-2.24 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 5v4M5 7h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg">Skill<em className="text-brand-600 not-italic">Bridge</em></span>
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {(['role', 'credentials'] as Step[]).map((s, i) => (
            <React.Fragment key={s}>
              <div className={cn(
                'flex items-center gap-1.5 text-xs font-medium',
                step === s ? 'text-stone-800' : i < (['role','credentials'] as Step[]).indexOf(step) ? 'text-brand-600' : 'text-stone-300'
              )}>
                <div className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs',
                  step === s            ? 'bg-stone-900 text-white'  :
                  i < (['role','credentials'] as Step[]).indexOf(step) ? 'bg-brand-500 text-white' :
                  'bg-sand-200 text-stone-400'
                )}>
                  {i < (['role','credentials'] as Step[]).indexOf(step) ? '✓' : i + 1}
                </div>
                {s === 'role' ? 'Роль' : 'Акаунт'}
              </div>
              {i < 1 && <div className="flex-1 h-px bg-sand-200" />}
            </React.Fragment>
          ))}
        </div>

        {/* ── Step 1: Role ─────────────────────────────────────────── */}
        {step === 'role' && (
          <div>
            <h1 className="font-serif text-3xl tracking-tight mb-2">Хто ти?</h1>
            <p className="text-stone-400 mb-7">Обери свою роль на платформі</p>

            <div className="space-y-3 mb-7">
              {ROLES.map(r => (
                <button key={r.value} onClick={() => setRole(r.value)}
                  className={cn(
                    'w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all',
                    role === r.value
                      ? 'border-stone-900 bg-stone-900 text-white ring-2 ring-stone-900/20'
                      : 'border-sand-200 bg-white hover:border-stone-300'
                  )}>
                  {/* <span className="text-2xl mt-0.5">{r.icon}</span> */}
                  <div>
                    <p className={cn('font-medium mb-0.5', role === r.value ? 'text-white' : 'text-stone-800')}>
                      {r.label}
                    </p>
                    <p className={cn('text-sm', role === r.value ? 'text-stone-300' : 'text-stone-400')}>
                      {r.desc}
                    </p>
                  </div>
                  <div className={cn(
                    'ml-auto mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                    role === r.value ? 'border-white' : 'border-sand-300'
                  )}>
                    {role === r.value && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            <button onClick={() => setStep('credentials')}
              className="w-full bg-stone-900 text-white text-sm font-medium py-3.5 rounded-xl
                         hover:bg-stone-800 active:scale-95 transition-all">
              Продовжити →
            </button>
          </div>
        )}

        {/* ── Step 2: Credentials ──────────────────────────────────── */}
        {step === 'credentials' && (
          <div>
            <button onClick={() => setStep('role')}
              className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700
                         transition-colors mb-6">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Назад
            </button>

            <h1 className="font-serif text-3xl tracking-tight mb-2">Створи акаунт</h1>
            <p className="text-stone-400 mb-7">
              Роль:{' '}
              <span className="text-stone-700 font-medium">
                {ROLES.find(r => r.value === role)?.label}
              </span>
            </p>

            {/* OAuth */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {['Google', 'GitHub'].map(p => (
                <button key={p}
                  className="flex items-center justify-center gap-2 bg-white border border-sand-200
                             rounded-xl py-3 text-sm font-medium text-stone-700
                             hover:border-stone-300 transition-all">
                  {p}
                </button>
              ))}
            </div>

            <div className="relative flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-sand-200" />
              <span className="text-xs text-stone-400">або через email</span>
              <div className="flex-1 h-px bg-sand-200" />
            </div>

            {apiError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Повне ім'я
                </label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Іван Петренко"
                  className={cn(
                    'w-full border rounded-xl px-4 py-3 text-sm placeholder:text-stone-300',
                    'focus:outline-none focus:ring-2 transition-all',
                    errors.fullName
                      ? 'border-red-300 focus:border-red-300 focus:ring-red-100'
                      : 'border-sand-200 focus:border-brand-300 focus:ring-brand-100'
                  )}
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={cn(
                    'w-full border rounded-xl px-4 py-3 text-sm placeholder:text-stone-300',
                    'focus:outline-none focus:ring-2 transition-all',
                    errors.email
                      ? 'border-red-300 focus:border-red-300 focus:ring-red-100'
                      : 'border-sand-200 focus:border-brand-300 focus:ring-brand-100'
                  )}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Пароль</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Мінімум 8 символів"
                    className={cn(
                      'w-full border rounded-xl px-4 py-3 pr-11 text-sm placeholder:text-stone-300',
                      'focus:outline-none focus:ring-2 transition-all',
                      errors.password
                        ? 'border-red-300 focus:border-red-300 focus:ring-red-100'
                        : 'border-sand-200 focus:border-brand-300 focus:ring-brand-100'
                    )}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2 9s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}

                {/* Password strength */}
                {password.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={cn(
                        'flex-1 h-1 rounded-full transition-all',
                        password.length >= i * 3
                          ? i <= 1 ? 'bg-red-400'
                          : i <= 2 ? 'bg-amber-400'
                          : i <= 3 ? 'bg-brand-400'
                          : 'bg-brand-500'
                          : 'bg-sand-200'
                      )} />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Підтвердження паролю
                </label>
                <input type={showPass ? 'text' : 'password'} value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Повтори пароль"
                  className={cn(
                    'w-full border rounded-xl px-4 py-3 text-sm placeholder:text-stone-300',
                    'focus:outline-none focus:ring-2 transition-all',
                    errors.confirm
                      ? 'border-red-300 focus:border-red-300 focus:ring-red-100'
                      : confirm && confirm === password
                      ? 'border-brand-300 focus:border-brand-300 focus:ring-brand-100'
                      : 'border-sand-200 focus:border-brand-300 focus:ring-brand-100'
                  )}
                />
                {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
                {confirm && confirm === password && !errors.confirm && (
                  <p className="text-xs text-brand-600 mt-1 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    Паролі збігаються
                  </p>
                )}
              </div>

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
                    Реєструємось...
                  </>
                ) : 'Створити акаунт'}
              </button>

              <p className="text-xs text-stone-400 text-center">
                Реєструючись, ти погоджуєшся з{' '}
                <Link href="/terms" className="underline hover:text-stone-600">умовами використання</Link>
                {' '}і{' '}
                <Link href="/privacy" className="underline hover:text-stone-600">політикою конфіденційності</Link>
              </p>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-stone-400 mt-6">
          Вже є акаунт?{' '}
          <Link href="/auth/login" className="text-brand-600 font-medium hover:text-brand-800 transition-colors">
            Увійти
          </Link>
        </p>
      </div>

      {/* Right — decorative */}
      <div className="hidden lg:flex flex-1 bg-stone-900 flex-col items-center justify-center relative overflow-hidden p-12">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-56 h-56 rounded-full bg-brand-400/10 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-xs space-y-4">
          <p className="text-white font-serif text-2xl mb-6">Приєднуйся до 18 000+ сесій</p>
          {[
            { num: '2 400+', label: 'Перевірених менторів' },
            { num: '4.9',    label: 'Середній рейтинг' },
            { num: '15 хв',  label: 'До першої сесії' },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <span className="text-stone-400 text-sm">{s.label}</span>
              <span className="text-white font-serif text-xl">{s.num}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
