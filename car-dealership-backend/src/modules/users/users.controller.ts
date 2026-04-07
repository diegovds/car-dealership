import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type {
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
} from './users.schema'
import * as service from './users.service'

export async function login(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply,
) {
  const result = await service.login(this, request.body)
  return reply.send(result)
}

export async function createUser(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply,
) {
  const user = await service.createUser(this, request.body)
  return reply.status(201).send(user)
}

export async function getUserById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const requesterId = (request.user as { sub: string }).sub
  const user = await service.getUserById(requesterId, request.params.id)
  return reply.send(user)
}

export async function updateUser(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserInput }>,
  reply: FastifyReply,
) {
  const requesterId = (request.user as { sub: string }).sub
  const user = await service.updateUser(
    this,
    requesterId,
    request.params.id,
    request.body,
  )
  return reply.send(user)
}

export async function deleteUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const requesterId = (request.user as { sub: string }).sub
  await service.deleteUser(requesterId, request.params.id)
  return reply.status(204).send()
}
