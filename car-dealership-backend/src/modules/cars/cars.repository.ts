import { and, count, desc, eq } from 'drizzle-orm'
import { db } from '../../db/client'
import { cars } from '../../db/schema'
import type {
  CreateCarInput,
  SearchFilters,
  UpdateCarInput,
} from './cars.schema'
import { buildSearchQueryParts } from './search/search-query-builder.js'

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

export async function findAllCars(page: number, perPage: number) {
  return db
    .select()
    .from(cars)
    .orderBy(desc(cars.createdAt))
    .limit(perPage)
    .offset((page - 1) * perPage)
}

export async function countAllCars() {
  const result = await db.select({ total: count() }).from(cars)
  return result[0].total
}

export async function findCarById(id: string) {
  const result = await db.select().from(cars).where(eq(cars.id, id))
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

export async function searchFilterCars(filters: SearchFilters) {
  const { where } = buildSearchQueryParts(filters)

  let query = db.select().from(cars).$dynamic()

  if (where) {
    query = query.where(where)
  }

  const items = await query.orderBy(desc(cars.createdAt))

  return { cars: items }
}
