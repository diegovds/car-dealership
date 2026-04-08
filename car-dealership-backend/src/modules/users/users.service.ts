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

export async function getUserById(id: string, page: number) {
  const user = await repository.findUserById(id)
  if (!user) {
    throw new AppError(404, 'Usuário não encontrado')
  }

  const perPage = 10
  const [carsList, total] = await Promise.all([
    repository.findUserCars(id, page, perPage),
    repository.countUserCars(id),
  ])

  return {
    user,
    cars: carsList,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  }
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

  const updateData: Record<string, unknown> = {}
  if (data.name) updateData.name = data.name
  if (data.email) updateData.email = data.email

  if (data.currentPassword && data.newPassword) {
    const current = await repository.findUserById(id)
    if (!current) {
      throw new AppError(404, 'Usuário não encontrado')
    }

    const validPassword = await app.bcrypt.compare(
      data.currentPassword,
      current.password,
    )
    if (!validPassword) {
      throw new AppError(401, 'Senha atual incorreta')
    }

    updateData.password = await app.bcrypt.hash(data.newPassword)
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
