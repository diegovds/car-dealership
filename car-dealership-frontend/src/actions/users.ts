'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { patchUsers } from '@/http/api'
import { getAuthToken } from '@/lib/auth'
import type { UpdateUserFormValues } from '@/lib/schemas'

export type UserActionResult = { error: string } | null

type UserResult = { id?: string; message?: string }

export async function updateUserAction(
  data: UpdateUserFormValues,
): Promise<UserActionResult> {
  const token = await getAuthToken()
  if (!token) redirect('/login')

  const payload: Record<string, string> = {}
  if (data.name) payload.name = data.name
  if (data.email) payload.email = data.email
  if (data.phone !== undefined) payload.phone = data.phone
  if (data.currentPassword) payload.currentPassword = data.currentPassword
  if (data.newPassword) payload.newPassword = data.newPassword

  const result = (await patchUsers(
    payload as Parameters<typeof patchUsers>[0],
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )) as UserResult

  if (!result.id) {
    return { error: result.message || 'Erro ao atualizar perfil' }
  }

  revalidatePath('/my-account')
  return null
}
