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
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = await service.getUserById(request.user.sub)
  return reply.send(user)
}

export async function updateUser(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: UpdateUserInput }>,
  reply: FastifyReply,
) {
  const user = await service.updateUser(this, request.user.sub, request.body)
  return reply.send(user)
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  await service.deleteUser(request.user.sub)
  return reply.status(204).send()
}
