import { z } from 'zod'
import { makeCreateGymsUseCase } from '@/use-cases/factories/make-create-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)
  const createGsymUseCase = makeCreateGymsUseCase()
  await createGsymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
