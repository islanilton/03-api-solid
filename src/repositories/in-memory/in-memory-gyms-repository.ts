import { Gym } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  gyms: Gym[] = []

  async findById(id: string) {
    const foundGym = this.gyms.find((gym) => gym.id === id)
    return foundGym ?? null
  }
}
