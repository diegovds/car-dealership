'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { patchUsers } from '@/http/api'
import { getAuthToken } from '@/lib/auth'
import type { UpdateUserFormValues } from '@/lib/schemas'

export type UserActionResult = { error: string } | null

export async function updateUserAction(data: UpdateUserFormValues): Promise<UserActionResult> {
  const token = await getAuthToken()
  if (!token) redirect('/login')

  const payload: Record<string, string> = {}
  if (data.name) payload.name = data.name
  if (data.email) payload.email = data.email
  if (data.currentPassword) payload.currentPassword = data.currentPassword
  if (data.newPassword) payload.newPassword = data.newPassword

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (await patchUsers(payload as any, {
    headers: { Authorization: `Bearer ${token}` },
  })) as any

  if (!result.id) {
    return { error: result.message || 'Erro ao atualizar perfil' }
  }

  revalidatePath('/my-account')
  return null
}
