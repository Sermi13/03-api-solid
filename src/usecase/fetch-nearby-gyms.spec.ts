import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNeabyGymsUseCase } from '@/usecase/fetch-nearby-gyms';
import { expect, describe, it, beforeEach } from 'vitest';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNeabyGymsUseCase;

describe('Fetch Nearby Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNeabyGymsUseCase(gymsRepository);
  });
  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });
    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: 0.0005761026482596698, //15 km distance
      longitude: -0.13610724866081417,
    });

    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(gyms).toHaveLength(1);

    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ]);
  });
});
