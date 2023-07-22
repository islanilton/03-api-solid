import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInsUseCase } from './check-in'

describe('Check-in Use Case', () => {
  let checkInRepository: InMemoryCheckInsRepository
  let sut: CheckInsUseCase

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new CheckInsUseCase(checkInRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
