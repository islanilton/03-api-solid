import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-In (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able create check-in', async () => {
    const gym = await prisma.gym.create({
      data: {
        title: 'Academia',
        description: 'Academia de musculação',
        phone: '999999999',
        latitude: -8.2105219,
        longitude: -34.9175703,
      },
    })
    const { token } = await createAndAuthenticateUser(app)
    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -8.2105219,
        longitude: -34.9175703,
      })
    expect(response.statusCode).toEqual(201)
  })
})
