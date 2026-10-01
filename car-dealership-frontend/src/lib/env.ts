import { z } from 'zod'

const envSchema = z.object({
  API_URL: z.string().url({ error: 'API_URL deve ser uma URL válida' }),
  SITE_URL: z
    .string()
    .url({ error: 'SITE_URL deve ser uma URL válida' })
    .default('http://localhost:3000'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const formatted = parsed.error.flatten((i) => i.message)
  console.error('❌ Variáveis de ambiente inválidas:')
  console.error(JSON.stringify(formatted.fieldErrors, null, 2))
  throw new Error('Variáveis de ambiente inválidas. Verifique seu arquivo .env')
}

export const env = parsed.data
