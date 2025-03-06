import { afterAll, beforeAll, describe, expect, it, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user';

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('Should be able to create gym', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const response = await request(app.server)
      .post('/gyms')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: 0,
        longitude: 0,
      });

    expect(response.statusCode).toEqual(201);
  });
});
