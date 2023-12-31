import { randomUUID } from 'node:crypto'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  users: User[] = []

  async findById(id: string) {
    const foundUser = this.users.find((user) => user.id === id)
    return foundUser ?? null
  }

  async findByEmail(email: string) {
    const foundUser = this.users.find((user) => user.email === email)
    return foundUser ?? null
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }
    this.users.push(user)
    return user
  }
}
