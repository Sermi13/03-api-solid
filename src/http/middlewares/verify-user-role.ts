import { FastifyReply, FastifyRequest } from 'fastify';

export function VerifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { role } = request.user;

      if (role !== roleToVerify) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }
    } catch (error) {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  };
}
