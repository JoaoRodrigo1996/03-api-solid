import { expect, it, describe, beforeEach } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/In-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search gyms use case', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(inMemoryGymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await inMemoryGymsRepository.create({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -22.5555727,
      longitude: -44.1499778,
    });

    await inMemoryGymsRepository.create({
      title: 'Typescript Gym',
      description: null,
      phone: null,
      latitude: -22.5555727,
      longitude: -44.1499778,
    });

    const { gyms } = await sut.execute({
      query: 'Typescript',
      page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript Gym', }),
    ]);
  });

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymsRepository.create({
        title: `Typescript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -22.5555727,
        longitude: -44.1499778,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Typescript',
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript Gym 21' }),
      expect.objectContaining({ title: 'Typescript Gym 22' }),
    ]);
  });
});
