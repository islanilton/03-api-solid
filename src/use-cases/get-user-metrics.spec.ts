import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { GetUserMetricsUseCase } from './get-user-metrics'

describe('Get User Metrics Use Case', () => {
  let checkInRepository: InMemoryCheckInsRepository
  let sut: GetUserMetricsUseCase

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInRepository.create({
      user_id: 'any_user_id',
      gym_id: 'any_gym_1',
    })

    await checkInRepository.create({
      user_id: 'any_user_id',
      gym_id: 'any_gym_2',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'any_user_id',
    })
    expect(checkInsCount).toEqual(2)
  })
})
