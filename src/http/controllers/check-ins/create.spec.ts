import { afterAll, beforeAll, describe, expect, it, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Create check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('Should be able to check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, 'MEMBER');

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: 0,
        longitude: 0,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('authorization', `Bearer ${token}`)
      .send({
        latitude: 0,
        longitude: 0,
      });

    expect(response.statusCode).toEqual(201);
  });
});
