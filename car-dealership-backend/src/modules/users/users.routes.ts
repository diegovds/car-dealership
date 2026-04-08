import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  createUserSchema,
  loginSchema,
  paginationQuerySchema,
  updateUserSchema,
  userResponseSchema,
  userWithCarsResponseSchema,
  tokenResponseSchema,
} from './users.schema'
import * as controller from './users.controller'
import { authenticate } from '../../middlewares/authenticate'

export async function usersRoutes(instance: FastifyInstance) {
  const app = instance.withTypeProvider<ZodTypeProvider>()

  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        security: [],
        summary: 'Cadastrar usuário',
        description: 'Cria uma nova conta com nome, email e senha.',
        body: createUserSchema,
        response: {
          201: userResponseSchema,
          409: z.object({ message: z.string() }),
        },
      },
    },
    controller.createUser,
  )

  app.post(
    '/users/login',
    {
      schema: {
        tags: ['Users'],
        security: [],
        summary: 'Login',
        description: 'Autentica o usuário e retorna um token JWT.',
        body: loginSchema,
        response: {
          200: tokenResponseSchema,
          401: z.object({ message: z.string() }),
        },
      },
    },
    controller.login,
  )

  app.get(
    '/users',
    {
      onRequest: [authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Obter perfil',
        description:
          'Retorna o perfil do usuário autenticado e seus carros paginados.',
        querystring: paginationQuerySchema,
        response: {
          200: userWithCarsResponseSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.getUserById,
  )

  app.patch(
    '/users',
    {
      onRequest: [authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Atualizar perfil',
        description: 'Atualiza nome, email ou senha do usuário autenticado.',
        body: updateUserSchema,
        response: {
          200: userResponseSchema,
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    controller.updateUser,
  )

  app.delete(
    '/users',
    {
      onRequest: [authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Excluir conta',
        description: 'Remove a conta do usuário autenticado e seus carros.',
        response: {
          204: z.null().describe('Usuário deletado com sucesso'),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.deleteUser,
  )
}
