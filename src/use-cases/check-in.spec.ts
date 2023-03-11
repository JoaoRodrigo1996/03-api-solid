import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/In-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('Check-in use case', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(inMemoryCheckInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2023, 2, 7, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    });

    console.log(checkIn.created_at);

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 2, 7, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    });

    await expect(() => sut.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    })).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 2, 7, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    });

    vi.setSystemTime(new Date(2023, 2, 8, 8, 0, 0));


    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});