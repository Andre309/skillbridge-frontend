import { create } from 'zustand'
import type { User } from '@/types'

interface AuthState {
  user:         User | null
  accessToken:  string | null
  isLoading:    boolean
  setAuth:      (user: User, token: string) => void
  clearAuth:    () => void
  setLoading:   (v: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user:        null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
  isLoading:   false,

  setAuth: (user, accessToken) => {
    if (typeof window !== 'undefined') localStorage.setItem('access_token', accessToken)
    set({ user, accessToken })
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('access_token')
    set({ user: null, accessToken: null })
  },

  setLoading: (isLoading) => set({ isLoading }),
}))
