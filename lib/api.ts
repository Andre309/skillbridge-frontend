const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message ?? 'Помилка запиту')
  return json.data as T
}

export const api = {
  get:    <T>(path: string, init?: RequestInit) => request<T>(path, { method: 'GET', ...init }),
  post:   <T>(path: string, body: unknown, init?: RequestInit) =>
            request<T>(path, { method: 'POST', body: JSON.stringify(body), ...init }),
  put:    <T>(path: string, body: unknown, init?: RequestInit) =>
            request<T>(path, { method: 'PUT', body: JSON.stringify(body), ...init }),
  patch:  <T>(path: string, body: unknown, init?: RequestInit) =>
            request<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...init }),
  delete: <T>(path: string, init?: RequestInit) => request<T>(path, { method: 'DELETE', ...init }),
}
