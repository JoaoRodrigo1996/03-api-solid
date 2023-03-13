import { expect, it, describe, beforeEach } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/In-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch nearby gyms use case', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await inMemoryGymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -22.5555727,
      longitude: -44.1499778,
    });

    await inMemoryGymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -22.4690139,
      longitude: -43.8249774,
      //-22.4690139,-43.8249774
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.5555727,
      userLongitude: -44.1499778
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym', }),
    ]);
  });
});
