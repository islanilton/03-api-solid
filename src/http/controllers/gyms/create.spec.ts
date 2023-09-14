import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia',
        description: 'Academia de musculação',
        phone: '999999999',
        latitude: -8.2105219,
        longitude: -34.9175703,
      })
    expect(response.statusCode).toEqual(201)
  })
})
