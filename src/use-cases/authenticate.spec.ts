import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const prismaRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(prismaRepository)

    await prismaRepository.create({
      name: 'testeName',
      email: 'teste1@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'teste1@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const prismaRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(prismaRepository)

    await expect(
      sut.execute({ email: 'teste1@gmail.com', password: '1234567' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const prismaRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(prismaRepository)

    await prismaRepository.create({
      name: 'testeName',
      email: 'teste1@gmail.com',
      password_hash: await hash('123456', 6),
    })

    await expect(
      sut.execute({ email: 'teste1@gmail.com', password: '1234567' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
