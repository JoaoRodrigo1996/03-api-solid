import { expect, it, describe, beforeEach } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/In-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym use case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(inMemoryGymsRepository);
  });

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -22.5555727,
      longitude: -44.1499778,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
