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
  userId: z.uuid().nullable(),
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

export const carListResponseSchema = z.array(carResponseSchema)

export const searchRequestSchema = z.object({
  search: z.string().min(1),
})

export const searchCarItemSchema = carResponseSchema.omit({ userId: true })
export const searchCarListSchema = z.array(searchCarItemSchema)

export const searchResponseSchema = z.object({
  items: searchCarListSchema,
  reply: z.string(),
})

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

export type SearchCarsRequestInput = z.infer<typeof searchRequestSchema>
export type SearchFilters = z.infer<typeof filtersSchema>
export type CreateCarInput = z.infer<typeof createCarSchema>
export type UpdateCarInput = z.infer<typeof updateCarSchema>
