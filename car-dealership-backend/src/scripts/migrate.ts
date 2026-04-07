import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import path from 'path'
import { Pool } from 'pg'
import { env } from '../config/env'

const pool = new Pool({ connectionString: env.DATABASE_URL })
const db = drizzle(pool)

async function main() {
  console.log('🚀 Rodando migrations...')

  await migrate(db, {
    migrationsFolder: path.resolve('./src/db/migrations'),
  })

  console.log('✅ Migrations aplicadas com sucesso!')
  await pool.end()
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro ao rodar migrations:', err)
  process.exit(1)
})
