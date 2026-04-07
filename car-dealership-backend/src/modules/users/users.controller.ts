import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { CreateUserInput, UpdateUserInput } from './users.schema'
import * as service from './users.service'

export async function listUsers(_request: FastifyRequest, reply: FastifyReply) {
  const users = await service.listUsers()
  return reply.send(users)
}

export async function getUserById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const user = await service.getUserById(request.params.id)
  return reply.send(user)
}

export async function createUser(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply,
) {
  const user = await service.createUser(this, request.body)
  return reply.status(201).send(user)
}

export async function updateUser(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserInput }>,
  reply: FastifyReply,
) {
  const user = await service.updateUser(this, request.params.id, request.body)
  return reply.send(user)
}

export async function deleteUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  await service.deleteUser(request.params.id)
  return reply.status(204).send()
}
