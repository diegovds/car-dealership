import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { sql } from 'drizzle-orm'
import { env } from '../config/env'

const pool = new Pool({ connectionString: env.DATABASE_URL })
const db = drizzle(pool)

async function main() {
  console.log('🗑️  Resetando banco de dados...')

  await db.execute(sql`TRUNCATE TABLE cars, users CASCADE`)

  console.log('✅ Tabelas limpas com sucesso!')

  await pool.end()
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro ao resetar:', err)
  process.exit(1)
})
