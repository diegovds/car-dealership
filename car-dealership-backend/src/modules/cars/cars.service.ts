import * as repository from './cars.repository'
import type {
  CreateCarInput,
  SearchCarsRequestInput,
  UpdateCarInput,
} from './cars.schema'
import { createAiSearchAgent } from './search/ai-search-agent.service'

const searchAgent = createAiSearchAgent()

class AppError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export async function listCars(page: number) {
  const perPage = 12
  const [cars, total] = await Promise.all([
    repository.findAllCars(page, perPage),
    repository.countAllCars(),
  ])

  return {
    cars,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  }
}

export async function getCarById(id: string) {
  const result = await repository.findCarByIdWithSeller(id)
  if (!result) {
    throw new AppError(404, 'Carro não encontrado')
  }
  const { sellerName, sellerPhone, ...car } = result
  return {
    ...car,
    seller: {
      name: sellerName ?? '',
      phone: sellerPhone ?? '',
    },
  }
}

export async function createCar(userId: string, data: CreateCarInput) {
  return repository.createCar(userId, data)
}

export async function updateCar(
  userId: string,
  id: string,
  data: UpdateCarInput,
) {
  const car = await repository.updateCar(id, userId, data)
  if (!car) {
    throw new AppError(404, 'Carro não encontrado')
  }
  return car
}

export async function deleteCar(userId: string, id: string) {
  const car = await repository.deleteCar(id, userId)
  if (!car) {
    throw new AppError(404, 'Carro não encontrado')
  }
  return car
}

export async function searchCars({ search, page }: SearchCarsRequestInput) {
  return searchAgent(search, page)
}
