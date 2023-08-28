import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export function makeCreateGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  return new CreateGymUseCase(gymsRepository)
}
