import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db, pool } from './client'

async function runMigrations() {
  console.log('Running migrations...')
  await migrate(db, { migrationsFolder: './src/db/migrations' })
  console.log('Migrations applied successfully.')
  await pool.end()
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
