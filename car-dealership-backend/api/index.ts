import type { IncomingMessage, ServerResponse } from 'node:http'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import path from 'node:path'
import { app } from '../src/app'
import { db } from '../src/db/client'

let initialized = false

async function initialize() {
  if (initialized) return
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), 'src/db/migrations'),
  })
  await app.ready()
  initialized = true
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  await initialize()
  app.server.emit('request', req, res)
}
