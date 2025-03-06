import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeSearchGymUseCase } from '@/usecase/factories/make-search-gyms-use-case';

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searcGymQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { q, page } = searcGymQuerySchema.parse(request.query);

  const searchGymUseCase = makeSearchGymUseCase();
  const { gyms } = await searchGymUseCase.execute({
    query: q,
    page,
  });

  return reply.status(200).send({ gyms });
}
