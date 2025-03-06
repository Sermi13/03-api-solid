import fastify from 'fastify';
import { ZodError } from 'zod';

import { env } from '@/env';
import { usersRoutes } from '@/http/controllers/users/routes';
import fastifyJwt from '@fastify/jwt';
import { gymsRoutes } from '@/http/controllers/gyms/routes';
import { checkInsRoutes } from '@/http/controllers/check-ins/routes';
import fastifyCookie from '@fastify/cookie';

export const app = fastify();

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation Error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Here we should trigger a error log on external tools like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});
