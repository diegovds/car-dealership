import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from '../config/env'

export const main: FastifyPluginAsyncZod = async (app) => {
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
}
