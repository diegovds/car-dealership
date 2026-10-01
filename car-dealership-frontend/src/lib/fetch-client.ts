import { env } from '@/lib/env'

export async function customFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${env.API_URL}${url}`, options)
  const body = [204, 205, 304].includes(res.status) ? null : await res.text()

  // Leituras (GET) com erro não devem virar dados "vazios" silenciosamente.
  // Mutations (POST/PATCH/DELETE) seguem devolvendo o corpo para as actions
  // exibirem `message`.
  if (!res.ok && (options?.method ?? 'GET') === 'GET') {
    throw new Error(`API ${res.status} em ${url}: ${body ?? ''}`)
  }

  return (body ? JSON.parse(body) : {}) as T
}
