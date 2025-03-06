import { afterAll, beforeAll, describe, expect, it, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user';
import { title } from 'process';
import { prisma } from '@/lib/prisma';

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('Should be able to search gym by name', async () => {
    const { token } = await createAndAuthenticateUser(app, 'MEMBER');

    await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: 0,
        longitude: 0,
      },
    });
    await prisma.gym.create({
      data: {
        title: 'TypeScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: 0,
        longitude: 0,
      },
    });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'JavaScript',
      })
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ]);
  });
});
