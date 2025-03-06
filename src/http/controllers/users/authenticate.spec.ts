import { afterAll, beforeAll, describe, expect, it, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('Should be able to Authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456Aa!',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456Aa!',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
