import { afterAll, beforeAll, describe, expect, it, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Check-in metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('Should be able to get count of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app, 'MEMBER');

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: 0,
        longitude: 0,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });

    const response = await request(app.server)
      .get(`/check-ins/metrics`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkInsCount).toEqual(2);
  });
});
