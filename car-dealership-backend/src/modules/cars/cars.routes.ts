import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { authenticate } from '../../middlewares/authenticate'
import * as controller from './cars.controller'
import {
  carIdParamSchema,
  carListPaginatedResponseSchema,
  carResponseSchema,
  createCarSchema,
  paginationQuerySchema,
  searchRequestSchema,
  searchResponseSchema,
  updateCarSchema,
} from './cars.schema'

export async function carsRoutes(instance: FastifyInstance) {
  const pub = instance.withTypeProvider<ZodTypeProvider>()

  pub.get(
    '/cars/search',
    {
      schema: {
        tags: ['Cars'],
        summary: 'Buscar carros por texto (IA)',
        description: 'Interpreta a busca com IA e retorna carros relevantes.',
        security: [],
        querystring: searchRequestSchema,
        response: {
          200: searchResponseSchema,
        },
      },
    },
    controller.searchCars,
  )

  pub.get(
    '/cars',
    {
      schema: {
        tags: ['Cars'],
        security: [],
        summary: 'Listar carros',
        description: 'Retorna todos os carros com paginação.',
        querystring: paginationQuerySchema,
        response: {
          200: carListPaginatedResponseSchema,
        },
      },
    },
    controller.listCars,
  )

  pub.get(
    '/cars/:id',
    {
      schema: {
        tags: ['Cars'],
        security: [],
        summary: 'Obter carro por ID',
        description: 'Retorna os detalhes de um carro específico.',
        params: carIdParamSchema,
        response: {
          200: carResponseSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.getCarById,
  )

  instance.register(async (scope) => {
    const app = scope.withTypeProvider<ZodTypeProvider>()

    app.addHook('onRequest', authenticate)

    app.post(
      '/cars',
      {
        schema: {
          tags: ['Cars'],
          summary: 'Cadastrar carro',
          description: 'Cadastra um novo carro para o usuário autenticado.',
          body: createCarSchema,
          response: {
            201: carResponseSchema,
          },
        },
      },
      controller.createCar,
    )

    app.patch(
      '/cars/:id',
      {
        schema: {
          tags: ['Cars'],
          summary: 'Atualizar carro',
          description: 'Atualiza os dados de um carro do usuário autenticado.',
          params: carIdParamSchema,
          body: updateCarSchema,
          response: {
            200: carResponseSchema,
            404: z.object({ message: z.string() }),
          },
        },
      },
      controller.updateCar,
    )

    app.delete(
      '/cars/:id',
      {
        schema: {
          tags: ['Cars'],
          summary: 'Excluir carro',
          description: 'Remove um carro do usuário autenticado.',
          params: carIdParamSchema,
          response: {
            204: z.null().describe('Carro deletado com sucesso'),
            404: z.object({ message: z.string() }),
          },
        },
      },
      controller.deleteCar,
    )
  })
}
