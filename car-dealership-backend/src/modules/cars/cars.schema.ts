import z from 'zod'

export const createCarSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  version: z.string().optional(),
  year: z.number().int().min(1900),
  price: z.string(),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  mileage: z.number().int().optional(),
  imageUrl: z.url().optional(),
})

export const updateCarSchema = z.object({
  brand: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  version: z.string().optional(),
  year: z.number().int().min(1900).optional(),
  price: z.string().optional(),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  mileage: z.number().int().optional(),
  imageUrl: z.url().optional(),
})

export const carIdParamSchema = z.object({
  id: z.uuid(),
})

export const carResponseSchema = z.object({
  id: z.uuid(),
  brand: z.string(),
  model: z.string(),
  version: z.string().nullable(),
  year: z.number(),
  price: z.string(),
  fuel: z.string().nullable(),
  transmission: z.string().nullable(),
  mileage: z.number().nullable(),
  imageUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const carWithSellerResponseSchema = carResponseSchema.extend({
  seller: z.object({
    name: z.string(),
    phone: z.string(),
  }),
})

export const carListResponseSchema = z.array(carResponseSchema)

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
})

export const paginationMetaSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  total: z.number(),
  totalPages: z.number(),
})

export const carListPaginatedResponseSchema = z.object({
  cars: carListResponseSchema,
  meta: paginationMetaSchema,
})

// ─── Filter schemas ──────────────────────────────────────────────────────────

const yearMaxFilter = new Date().getFullYear() + 1

const optionalFilterYear = z.coerce
  .number()
  .int()
  .min(1950)
  .max(yearMaxFilter)
  .optional()

const optionalFilterMileage = z.coerce.number().int().min(0).optional()

export const filtersSchema = z.object({
  brand: z.string().trim().min(1).optional(),
  model: z.string().trim().min(1).optional(),
  version: z.string().trim().min(1).max(120).optional(),
  year: optionalFilterYear,
  yearMin: optionalFilterYear,
  yearMax: optionalFilterYear,
  mileageMin: optionalFilterMileage,
  mileageMax: optionalFilterMileage,
  fuel: z.string().trim().min(1).optional(),
  transmission: z.string().trim().min(1).optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
})

export const filterQuerySchema = filtersSchema.extend({
  page: z.coerce.number().int().min(1).default(1),
})

// ─── Search schemas ──────────────────────────────────────────────────────────

export const searchRequestSchema = z.object({
  search: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
})

export const searchCarItemSchema = carResponseSchema
export const searchCarListSchema = z.array(searchCarItemSchema)

export const searchResponseSchema = z.object({
  cars: searchCarListSchema,
  reply: z.string(),
  meta: paginationMetaSchema,
  filters: filtersSchema,
})

// ─── Types ───────────────────────────────────────────────────────────────────

export type SearchCarsRequestInput = z.infer<typeof searchRequestSchema>
export type FilterCarsInput = z.infer<typeof filterQuerySchema>
export type SearchFilters = z.infer<typeof filtersSchema>
export type CreateCarInput = z.infer<typeof createCarSchema>
export type UpdateCarInput = z.infer<typeof updateCarSchema>
