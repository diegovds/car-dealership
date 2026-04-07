import type { FastifyInstance } from 'fastify'
import z from 'zod'
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  userResponseSchema,
  userListResponseSchema,
} from './users.schema'
import * as controller from './users.controller'

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: 'Listar todos os usuários',
        description: 'Retorna uma lista com todos os usuários cadastrados.',
        response: {
          200: userListResponseSchema,
        },
      },
    },
    controller.listUsers,
  )

  app.get(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        summary: 'Buscar usuário por ID',
        description: 'Retorna os dados de um usuário específico.',
        params: userIdParamSchema,
        response: {
          200: userResponseSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.getUserById,
  )

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

  app.patch(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        summary: 'Atualizar um usuário',
        description: 'Atualiza os dados de um usuário existente.',
        params: userIdParamSchema,
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
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        summary: 'Deletar um usuário',
        description: 'Remove um usuário e todos os seus carros associados.',
        params: userIdParamSchema,
        response: {
          204: z.null().describe('Usuário deletado com sucesso'),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.deleteUser,
  )
}
