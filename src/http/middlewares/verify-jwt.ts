import { FastifyReply, FastifyRequest } from 'fastify';

export async function VerifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.code(401).send({ message: 'Unauthorized' });
  }
}
