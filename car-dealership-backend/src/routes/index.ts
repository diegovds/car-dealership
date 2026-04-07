import { FastifyInstance } from 'fastify'
import z from 'zod'
import { env } from '../config/env'
import { carsRoutes } from '../modules/cars/cars.routes'
import { usersRoutes } from '../modules/users/users.routes'

export async function routes(app: FastifyInstance) {
  app.get(
    '/',
    {
      schema: {
        tags: ['Default'],
        security: [],
        summary: 'Página inicial da API',
        description:
          'Retorna uma mensagem de boas-vindas e um link para a documentação da API.',
        response: {
          200: z.object({
            Car_Dealership_API: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      reply.send({
        Car_Dealership_API: `Go to ${env.BASE_URL}/docs to see the documentation.`,
      })
    },
  )
  app.register(usersRoutes)
  app.register(carsRoutes)
}
