import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from '@/usecase/errors/user-already-exists-error';
import { RegisterUseCase } from '@/usecase/register';
import { compare } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });
  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456Aa!',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456Aa!',
    });

    const isPasswordHashCorrect = await compare('123456Aa!', user.password_hash);
    expect(isPasswordHashCorrect).toBeTruthy();
  });

  it('should not be able to register with the same email twice', async () => {
    await sut.execute({
      name: 'John Doe1',
      email: 'johndoe@example.com',
      password: '123456Aa!',
    });
    await expect(() =>
      sut.execute({
        name: 'John Doe2',
        email: 'johndoe@example.com',
        password: '123456Aa!',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
