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
  imageUrl: z.string().url().optional(),
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
  imageUrl: z.string().url().optional(),
})

export const carIdParamSchema = z.object({
  id: z.uuid(),
})

export const carResponseSchema = z.object({
  id: z.uuid(),
  userId: z.string().uuid().nullable(),
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

export type CreateCarInput = z.infer<typeof createCarSchema>
export type UpdateCarInput = z.infer<typeof updateCarSchema>
