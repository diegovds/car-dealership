import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  createUserSchema,
  loginSchema,
  updateUserSchema,
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
    '/users',
    {
      onRequest: [authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Buscar perfil do usuário',
        description: 'Retorna os dados do usuário autenticado.',
        response: {
          200: userResponseSchema,
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
        summary: 'Atualizar usuário',
        description: 'Atualiza os dados do usuário autenticado.',
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
        summary: 'Deletar usuário',
        description: 'Remove o usuário autenticado e todos os seus carros.',
        response: {
          204: z.null().describe('Usuário deletado com sucesso'),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.deleteUser,
  )
}
