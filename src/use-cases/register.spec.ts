import { expect, it, describe, beforeEach } from 'vitest';
import { compare } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/In-memory/in-memory-users-repository';
import { UserAlreadyExistError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(inMemoryUsersRepository);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hashed user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com';

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456'
    });

    await expect(() => sut.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
