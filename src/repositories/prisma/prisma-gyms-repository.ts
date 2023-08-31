import { prisma } from '@/lib/prisma'
import { Gym, Prisma } from '@prisma/client'
import { GymsRepository, findManyNearbyParams } from '../gyms-repository'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    return prisma.gym.findUnique({
      where: {
        id,
      },
    })
  }

  async findManyNearby({ latitude, longitude }: findManyNearbyParams) {
    return prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
  }

  searchMany(query: string, page: number) {
    return prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  create(data: Prisma.GymCreateInput) {
    return prisma.gym.create({
      data,
    })
  }
}
