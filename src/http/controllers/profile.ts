import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, replay: FastifyReply) {
  await request.jwtVerify()
  console.log(request.user.sub)
  return replay.status(200).send()
}
