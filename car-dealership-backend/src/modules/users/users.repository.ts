import { count, desc, eq } from 'drizzle-orm'
import { db } from '../../db/client'
import { cars, users } from '../../db/schema'
import type { CreateUserInput, UpdateUserInput } from './users.schema'

export async function findUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id))
  return result[0] ?? null
}

export async function findUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email))
  return result[0] ?? null
}

export async function createUser(data: CreateUserInput & { password: string }) {
  const result = await db.insert(users).values(data).returning()
  return result[0]
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const result = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning()
  return result[0] ?? null
}

export async function deleteUser(id: string) {
  const result = await db.delete(users).where(eq(users.id, id)).returning()
  return result[0] ?? null
}

export async function findUserCars(
  userId: string,
  page: number,
  perPage: number,
) {
  return db
    .select()
    .from(cars)
    .where(eq(cars.userId, userId))
    .orderBy(desc(cars.createdAt))
    .limit(perPage)
    .offset((page - 1) * perPage)
}

export async function countUserCars(userId: string) {
  const result = await db
    .select({ total: count() })
    .from(cars)
    .where(eq(cars.userId, userId))
  return result[0].total
}
