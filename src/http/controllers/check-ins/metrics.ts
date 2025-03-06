import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserMetricsUseCase } from '@/usecase/factories/make-get-user-metrics-use-case';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const checkinMetricsUseCase = makeGetUserMetricsUseCase();
  const { checkInsCount } = await checkinMetricsUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ checkInsCount });
}
