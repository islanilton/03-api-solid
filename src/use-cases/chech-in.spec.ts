import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInsUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

describe('Check-in Use Case', () => {
  let checkInRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: CheckInsUseCase

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInsUseCase(checkInRepository, gymsRepository)

    gymsRepository.gyms.push({
      id: 'any_gym_id',
      title: 'any_gym_title',
      phone: 'any_gym_phone',
      description: 'any_gym_description',
      latitude: new Decimal(-8.2105219),
      longitude: new Decimal(-34.9175703),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
      userLatitude: -8.2105219,
      userLongitude: -34.9175703,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date('2022-01-01'))
    await sut.execute({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
      userLatitude: -8.2105219,
      userLongitude: -34.9175703,
    })

    await expect(() =>
      sut.execute({
        userId: 'any_user_id',
        gymId: 'any_gym_id',
        userLatitude: -8.2105219,
        userLongitude: -34.9175703,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date('2022-01-01'))
    await sut.execute({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
      userLatitude: -8.2105219,
      userLongitude: -34.9175703,
    })

    vi.setSystemTime(new Date('2022-01-02'))
    const { checkIn } = await sut.execute({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
      userLatitude: -8.2105219,
      userLongitude: -34.9175703,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'any_gym_id_2',
      title: 'any_gym_title',
      phone: 'any_gym_phone',
      description: 'any_gym_description',
      latitude: new Decimal(-14.4095261),
      longitude: new Decimal(-51.31668),
    })

    await expect(() =>
      sut.execute({
        userId: 'any_user_id',
        gymId: 'any_gym_id_2',
        userLatitude: -8.2105219,
        userLongitude: -34.9175703,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
