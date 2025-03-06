import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(app: FastifyInstance, role: 'ADMIN' | 'MEMBER') {
  await prisma.user.create({
    data: {
      name: 'Jogn Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456Aa!', 6),
      role,
    },
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456Aa!',
  });

  const { token } = authResponse.body;

  return { token };
}
