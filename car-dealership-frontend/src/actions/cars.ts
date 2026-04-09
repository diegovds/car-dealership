'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteCarsId, patchCarsId, postCars } from '@/http/api'
import { getAuthToken } from '@/lib/auth'
import type { CarFormValues } from '@/lib/schemas'

export type CarActionResult = { error: string } | null

type CarResult = { id?: string; message?: string }

export async function createCarAction(
  data: CarFormValues,
): Promise<CarActionResult> {
  const token = await getAuthToken()
  if (!token) redirect('/login')

  const { imageUrl, ...rest } = data

  const result = (await postCars(
    { ...rest, imageUrl: imageUrl || undefined },
    { headers: { Authorization: `Bearer ${token}` } },
  )) as CarResult

  if (!result.id) {
    return { error: result.message || 'Erro ao cadastrar carro' }
  }

  revalidatePath('/my-account')
  return null
}

export async function updateCarAction(
  id: string,
  data: Partial<CarFormValues>,
): Promise<CarActionResult> {
  const token = await getAuthToken()
  if (!token) redirect('/login')

  const { imageUrl, ...rest } = data

  const result = (await patchCarsId(
    id,
    { ...rest, imageUrl: imageUrl || undefined },
    { headers: { Authorization: `Bearer ${token}` } },
  )) as CarResult

  if (!result.id) {
    return { error: result.message || 'Erro ao atualizar carro' }
  }

  revalidatePath('/my-account')
  return null
}

export async function deleteCarAction(id: string): Promise<void> {
  const token = await getAuthToken()
  if (!token) redirect('/login')

  await deleteCarsId(id, { headers: { Authorization: `Bearer ${token}` } })
  revalidatePath('/my-account')
}
