import { InMemoryUsersRepository } from '@/repositories/In-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { expect, it, describe } from 'vitest';
import { UserAlreadyExistError } from './errors/user-already-exists-error';

import { RegisterUseCase } from './register';

describe('Register use case', () => {
  it('should be able to register', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hashed user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const email = 'johndoe@example.com';

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456'
    });

    await expect(() => registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
