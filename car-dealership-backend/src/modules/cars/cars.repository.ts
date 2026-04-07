import { and, eq } from 'drizzle-orm'
import { db } from '../../db/client'
import { cars } from '../../db/schema'
import type { CreateCarInput, UpdateCarInput } from './cars.schema'

export async function findCarsByUserId(userId: string) {
  return db.select().from(cars).where(eq(cars.userId, userId))
}

export async function findCarByIdAndUserId(id: string, userId: string) {
  const result = await db
    .select()
    .from(cars)
    .where(and(eq(cars.id, id), eq(cars.userId, userId)))
  return result[0] ?? null
}

export async function createCar(userId: string, data: CreateCarInput) {
  const result = await db
    .insert(cars)
    .values({ ...data, userId })
    .returning()
  return result[0]
}

export async function updateCar(
  id: string,
  userId: string,
  data: UpdateCarInput,
) {
  const result = await db
    .update(cars)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(cars.id, id), eq(cars.userId, userId)))
    .returning()
  return result[0] ?? null
}

export async function deleteCar(id: string, userId: string) {
  const result = await db
    .delete(cars)
    .where(and(eq(cars.id, id), eq(cars.userId, userId)))
    .returning()
  return result[0] ?? null
}
