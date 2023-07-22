import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const prismaRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaRepository)
    const { user } = await registerUseCase.execute({
      name: 'testeName',
      email: 'teste1@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const prismaRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaRepository)
    const { user } = await registerUseCase.execute({
      name: 'testeName',
      email: 'teste1@gmail.com',
      password: '123456',
    })
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should no be able to register with same email twice', async () => {
    const prismaRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaRepository)
    await registerUseCase.execute({
      name: 'testeName',
      email: 'teste1@gmail.com',
      password: '123456',
    })
    await expect(
      registerUseCase.execute({
        name: 'testeName',
        email: 'teste1@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
