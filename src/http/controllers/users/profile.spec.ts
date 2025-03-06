import { afterAll, beforeAll, describe, expect, it, test } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user';

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('Should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app, 'MEMBER');

    const profileResponse = await request(app.server)
      .get('/me')
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
      }),
    );
  });
});
