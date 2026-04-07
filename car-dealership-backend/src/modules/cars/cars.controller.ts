import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateCarInput, UpdateCarInput } from './cars.schema'
import * as service from './cars.service'

function getUserId(request: FastifyRequest): string {
  return (request.user as { sub: string }).sub
}

export async function listCars(request: FastifyRequest, reply: FastifyReply) {
  const cars = await service.listCars(getUserId(request))
  return reply.send(cars)
}

export async function getCarById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const car = await service.getCarById(getUserId(request), request.params.id)
  return reply.send(car)
}

export async function createCar(
  request: FastifyRequest<{ Body: CreateCarInput }>,
  reply: FastifyReply,
) {
  const car = await service.createCar(getUserId(request), request.body)
  return reply.status(201).send(car)
}

export async function updateCar(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateCarInput }>,
  reply: FastifyReply,
) {
  const car = await service.updateCar(
    getUserId(request),
    request.params.id,
    request.body,
  )
  return reply.send(car)
}

export async function deleteCar(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  await service.deleteCar(getUserId(request), request.params.id)
  return reply.status(204).send()
}
