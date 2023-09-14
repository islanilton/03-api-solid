import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able search nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia',
        description: 'Academia de musculação',
        phone: '999999999',
        latitude: -8.2105219,
        longitude: -34.9175703,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia FIT',
        description: 'Academia de FIT',
        phone: '999999999',
        latitude: -20.2105229,
        longitude: -104.9175713,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: '-8.2105219',
        longitude: '-34.9175703',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Academia',
        description: 'Academia de musculação',
      }),
    ])
  })
})
