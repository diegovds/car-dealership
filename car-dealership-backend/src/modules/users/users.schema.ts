import z from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  phone: z.string().min(10).max(20).optional(),
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export const updateUserSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.email().optional(),
    phone: z.string().min(10).max(20).optional(),
    currentPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) return false
      if (data.currentPassword && !data.newPassword) return false
      return true
    },
    {
      message: 'currentPassword e newPassword devem ser informados juntos',
    },
  )

export const userResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const tokenResponseSchema = z.object({
  token: z.string(),
})

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
})

export const paginationMetaSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  total: z.number(),
  totalPages: z.number(),
})

export const userWithCarsResponseSchema = z.object({
  user: userResponseSchema,
  cars: z.array(
    z.object({
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
    }),
  ),
  meta: paginationMetaSchema,
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
