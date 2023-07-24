import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInsUseCase } from './check-in'

describe('Check-in Use Case', () => {
  let checkInRepository: InMemoryCheckInsRepository
  let sut: CheckInsUseCase

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new CheckInsUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })
    console.log(checkIn)
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date('2022-01-01'))
    await sut.execute({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })

    await expect(() =>
      sut.execute({
        userId: 'any_user_id',
        gymId: 'any_gym_id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date('2022-01-01'))
    await sut.execute({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })

    vi.setSystemTime(new Date('2022-01-02'))
    const { checkIn } = await sut.execute({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })
})
