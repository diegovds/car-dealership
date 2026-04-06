import { FastifyInstance } from 'fastify'
import { main } from '../controllers/main'

export async function routes(app: FastifyInstance) {
  app.register(main)
}
