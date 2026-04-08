import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { authenticate } from '../../middlewares/authenticate'
import * as controller from './cars.controller'
import {
  carIdParamSchema,
  carListResponseSchema,
  carResponseSchema,
  createCarSchema,
  searchRequestSchema,
  updateCarSchema,
} from './cars.schema'

export async function carsRoutes(instance: FastifyInstance) {
  const app = instance.withTypeProvider<ZodTypeProvider>()

  app.addHook('onRequest', authenticate)

  app.get(
    '/cars',
    {
      schema: {
        tags: ['Cars'],
        summary: 'Listar carros do usuário',
        description: 'Retorna todos os carros do usuário autenticado.',
        response: {
          200: carListResponseSchema,
        },
      },
    },
    controller.listCars,
  )

  app.get(
    '/cars/:id',
    {
      schema: {
        tags: ['Cars'],
        summary: 'Buscar carro por ID',
        description: 'Retorna um carro específico do usuário autenticado.',
        params: carIdParamSchema,
        response: {
          200: carResponseSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.getCarById,
  )

  app.post(
    '/cars',
    {
      schema: {
        tags: ['Cars'],
        summary: 'Cadastrar um carro',
        description: 'Cria um novo carro vinculado ao usuário autenticado.',
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
        summary: 'Atualizar um carro',
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

  app.get(
    '/cars/search',
    {
      schema: {
        tags: ['Cars'],
        summary: 'Buscar carros por texto',
        description:
          'Retorna carros do usuário autenticado filtrados pelo termo de busca.',
        querystring: searchRequestSchema,
        response: {
          200: carListResponseSchema,
        },
      },
    },
    controller.searchCars,
  )

  app.delete(
    '/cars/:id',
    {
      schema: {
        tags: ['Cars'],
        summary: 'Deletar um carro',
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
}
