import type { FastifyInstance } from 'fastify'
import * as repository from './users.repository'
import type { CreateUserInput, UpdateUserInput } from './users.schema'

class AppError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export async function listUsers() {
  return repository.findAllUsers()
}

export async function getUserById(id: string) {
  const user = await repository.findUserById(id)
  if (!user) {
    throw new AppError(404, 'Usuário não encontrado')
  }
  return user
}

export async function createUser(app: FastifyInstance, data: CreateUserInput) {
  const existing = await repository.findUserByEmail(data.email)
  if (existing) {
    throw new AppError(409, 'Email já cadastrado')
  }

  const hashedPassword = await app.bcrypt.hash(data.password)
  return repository.createUser({ ...data, password: hashedPassword })
}

export async function updateUser(
  app: FastifyInstance,
  id: string,
  data: UpdateUserInput,
) {
  if (data.email) {
    const existing = await repository.findUserByEmail(data.email)
    if (existing && existing.id !== id) {
      throw new AppError(409, 'Email já cadastrado')
    }
  }

  const updateData = { ...data }
  if (data.password) {
    updateData.password = await app.bcrypt.hash(data.password)
  }

  const user = await repository.updateUser(id, updateData)
  if (!user) {
    throw new AppError(404, 'Usuário não encontrado')
  }
  return user
}

export async function deleteUser(id: string) {
  const user = await repository.deleteUser(id)
  if (!user) {
    throw new AppError(404, 'Usuário não encontrado')
  }
  return user
}
