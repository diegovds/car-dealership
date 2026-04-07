import type { FastifyInstance } from 'fastify'
import * as repository from './users.repository'
import type {
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
} from './users.schema'

class AppError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export async function login(app: FastifyInstance, data: LoginInput) {
  const user = await repository.findUserByEmail(data.email)
  if (!user) {
    throw new AppError(401, 'Email ou senha inválidos')
  }

  const validPassword = await app.bcrypt.compare(data.password, user.password)
  if (!validPassword) {
    throw new AppError(401, 'Email ou senha inválidos')
  }

  const token = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' })
  return { token }
}

export async function getUserById(requesterId: string, id: string) {
  if (requesterId !== id) {
    throw new AppError(403, 'Acesso negado')
  }

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
  requesterId: string,
  id: string,
  data: UpdateUserInput,
) {
  if (requesterId !== id) {
    throw new AppError(403, 'Acesso negado')
  }

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

export async function deleteUser(requesterId: string, id: string) {
  if (requesterId !== id) {
    throw new AppError(403, 'Acesso negado')
  }

  const user = await repository.deleteUser(id)
  if (!user) {
    throw new AppError(404, 'Usuário não encontrado')
  }
  return user
}
