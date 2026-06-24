import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user:        User | null
  accessToken: string | null
  isLoading:   boolean
  setAuth:     (user: User, token: string) => void
  clearAuth:   () => void
  setLoading:  (v: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:        null,
      accessToken: null,
      isLoading:   false,

      setAuth: (user, accessToken) => set({ user, accessToken }),

      clearAuth: () => set({ user: null, accessToken: null }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name:    'skillbridge_auth',   // ключ у localStorage
      partialize: (state) => ({      // зберігаємо тільки потрібне
        user:        state.user,
        accessToken: state.accessToken,
      }),
    }
  )
)
