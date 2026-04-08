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

export async function listCars(userId: string) {
  return repository.findCarsByUserId(userId)
}

export async function getCarById(userId: string, id: string) {
  const car = await repository.findCarByIdAndUserId(id, userId)
  if (!car) {
    throw new AppError(404, 'Carro não encontrado')
  }
  return car
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

export async function searchCars({ search }: SearchCarsRequestInput) {
  const resul = await searchAgent(search)
  return resul
}
