import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Nearby Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('Should be able to search nearby gym', async () => {
    const { token } = await createAndAuthenticateUser(app, 'MEMBER');

    await prisma.gym.create({
      data: {
        title: 'Close Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: 0,
        longitude: 0,
      },
    });

    await prisma.gym.create({
      data: {
        title: 'Far Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: 0.0005761026482596698, //15 km distance
        longitude: -0.13610724866081417,
      },
    });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: 0,
        longitude: 0,
      })
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Close Gym',
      }),
    ]);
  });
});
