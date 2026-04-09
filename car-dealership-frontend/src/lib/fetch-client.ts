import { env } from '@/lib/env'

export async function customFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${env.API_URL}${url}`, options)
  const body = [204, 205, 304].includes(res.status) ? null : await res.text()
  return (body ? JSON.parse(body) : {}) as T
}
