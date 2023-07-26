import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

describe('Fetch User Check-in Use Case', () => {
  let checkInRepository: InMemoryCheckInsRepository
  let sut: FetchUserCheckInsHistoryUseCase

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository)
  })

  it('should be able to fetch check-in history', async () => {
    await checkInRepository.create({
      user_id: 'any_user_id',
      gym_id: 'any_gym_1',
    })

    await checkInRepository.create({
      user_id: 'any_user_id',
      gym_id: 'any_gym_2',
    })

    const { checkIns } = await sut.execute({
      userId: 'any_user_id',
      page: 1,
    })
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'any_gym_1',
      }),
      expect.objectContaining({
        gym_id: 'any_gym_2',
      }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        user_id: 'any_user_id',
        gym_id: `any_gym_${i}`,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'any_user_id',
      page: 2,
    })
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'any_gym_21',
      }),
      expect.objectContaining({
        gym_id: 'any_gym_22',
      }),
    ])
  })
})
