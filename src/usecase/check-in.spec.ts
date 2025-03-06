import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CheckInUseCase } from '@/usecase/check-in';
import { MaxDistanceError } from '@/usecase/errors/max-distance-error';
import { MaxNumberOfCheckInsError } from '@/usecase/errors/max-number-of-check-ins-error';
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;

let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();

    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: 'Some gym',
      phone: '+5518996873360',
      latitude: 0,
      longitude: 0,
      created_at: new Date(),
      updated_at: new Date(),
    });

    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it('should not be able to check twice on the same day', async () => {
    vi.setSystemTime(new Date(2025, 1, 25, 9, 0, 0));
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.instanceOf(MaxNumberOfCheckInsError);
  });
  it('should be able to checkIn on diferent days', async () => {
    vi.setSystemTime(new Date(2025, 1, 25, 9, 0, 0));
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2025, 1, 26, 9, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to checkIn when gym does not exist', async () => {
    await expect(
      sut.execute({
        gymId: 'non-existing-id',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.instanceOf(Error);
  });

  it('should not be able to checkIn not inside the 100m range from the gym', async () => {
    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -0.0008328423040014718, // 424m away from the gym
        userLongitude: -0.003889432193895443,
      }),
    ).rejects.instanceOf(MaxDistanceError);
  });
});
