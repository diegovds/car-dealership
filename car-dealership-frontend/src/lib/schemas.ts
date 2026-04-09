import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ error: 'Email inválido' }),
  password: z
    .string()
    .min(6, { error: 'Senha deve ter no mínimo 6 caracteres' }),
})

export const registerSchema = z.object({
  name: z.string().min(2, { error: 'Nome deve ter no mínimo 2 caracteres' }),
  email: z.string().email({ error: 'Email inválido' }),
  password: z
    .string()
    .min(6, { error: 'Senha deve ter no mínimo 6 caracteres' }),
})

export const carSchema = z.object({
  brand: z.string().min(1, { error: 'Marca é obrigatória' }),
  model: z.string().min(1, { error: 'Modelo é obrigatório' }),
  version: z.string().optional(),
  year: z
    .number({ error: 'Ano inválido' })
    .min(1900, { error: 'Ano deve ser maior que 1900' })
    .max(new Date().getFullYear() + 1, { error: 'Ano inválido' }),
  price: z.string().min(1, { error: 'Preço é obrigatório' }),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  mileage: z.number().optional(),
  imageUrl: z
    .string()
    .url({ error: 'URL inválida' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
})

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, { error: 'Nome deve ter no mínimo 2 caracteres' })
      .optional()
      .or(z.literal('')),
    email: z
      .string()
      .email({ error: 'Email inválido' })
      .optional()
      .or(z.literal('')),
    currentPassword: z
      .string()
      .min(6, { error: 'Senha atual deve ter no mínimo 6 caracteres' })
      .optional()
      .or(z.literal('')),
    newPassword: z
      .string()
      .min(6, { error: 'Nova senha deve ter no mínimo 6 caracteres' })
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) return false
      return true
    },
    {
      message: 'Informe a senha atual para definir uma nova',
      path: ['currentPassword'],
    },
  )

export const updateCarSchema = carSchema.partial()

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type CarFormValues = z.infer<typeof carSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
export type UpdateCarFormValues = z.infer<typeof updateCarSchema>
