import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  createUserSchema,
  loginSchema,
  updateUserSchema,
  userIdParamSchema,
  userResponseSchema,
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
        summary: 'Criar um novo usuário',
        description: 'Cria um novo usuário com nome, email e senha.',
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
        summary: 'Autenticar usuário',
        description: 'Retorna um token JWT para uso nos endpoints protegidos.',
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
    '/users/:id',
    {
      onRequest: [authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Buscar usuário por ID',
        description:
          'Retorna os dados do usuário autenticado. O ID deve ser o mesmo do token.',
        params: userIdParamSchema,
        response: {
          200: userResponseSchema,
          403: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.getUserById,
  )

  app.patch(
    '/users/:id',
    {
      onRequest: [authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Atualizar um usuário',
        description:
          'Atualiza os dados do usuário autenticado. O ID deve ser o mesmo do token.',
        params: userIdParamSchema,
        body: updateUserSchema,
        response: {
          200: userResponseSchema,
          403: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    controller.updateUser,
  )

  app.delete(
    '/users/:id',
    {
      onRequest: [authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Deletar um usuário',
        description:
          'Remove o usuário autenticado e todos os seus carros. O ID deve ser o mesmo do token.',
        params: userIdParamSchema,
        response: {
          204: z.null().describe('Usuário deletado com sucesso'),
          403: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.deleteUser,
  )
}
