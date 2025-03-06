import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymUseCase } from '@/usecase/search-gyms';
import { expect, describe, it, beforeEach } from 'vitest';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe('Search Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });
  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });
    await gymsRepository.create({
      title: 'Typescript Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);

    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym',
      }),
    ]);
  });

  it('should be able to search paginated gym', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript-${i}`,
        description: null,
        phone: null,
        latitude: 0,
        longitude: 0,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);

    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript-21',
      }),
      expect.objectContaining({
        title: 'Javascript-22',
      }),
    ]);
  });
});
