import { and, eq, gte, ilike, lte } from 'drizzle-orm'
import { cars } from '../../../db/schema/cars.js'
import type { SearchFilters } from '../cars.schema.js'

export function buildSearchQueryParts(filters: SearchFilters) {
  const where = and(
    filters.brand ? ilike(cars.brand, `%${filters.brand}%`) : undefined,
    filters.model ? ilike(cars.model, `%${filters.model}%`) : undefined,
    filters.version ? ilike(cars.version, `%${filters.version}%`) : undefined,
    filters.year !== undefined ? eq(cars.year, filters.year) : undefined,
    filters.yearMin !== undefined ? gte(cars.year, filters.yearMin) : undefined,
    filters.yearMax !== undefined ? lte(cars.year, filters.yearMax) : undefined,
    filters.mileageMin !== undefined
      ? gte(cars.mileage, filters.mileageMin)
      : undefined,
    filters.mileageMax !== undefined
      ? lte(cars.mileage, filters.mileageMax)
      : undefined,
  )

  return where ? { where } : {}
}
