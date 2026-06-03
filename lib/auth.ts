const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export interface RegisterPayload {
  email:       string
  password:    string
  fullName:    string
  role:        'mentee' | 'mentor' | 'both'
  timezone:    string
  locale:      string
}

export interface LoginPayload {
  email:    string
  password: string
}

export interface AuthResponse {
  user:         { id: string; email: string; fullName: string; role: string }
  accessToken:  string
  refreshToken: string
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message ?? 'Помилка запиту')
  return json.data as T
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    post<AuthResponse>('/auth/register', payload),

  login: (payload: LoginPayload) =>
    post<AuthResponse>('/auth/login', payload),
}

// Mock для demo-режиму
export function getMockAuthResponse(email: string, fullName: string, role: string): AuthResponse {
  return {
    user:         { id: 'mock-user-1', email, fullName, role },
    accessToken:  'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now(),
  }
}
