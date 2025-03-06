import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from '@/usecase/errors/resource-not-found-error';
import {
  Coordinate,
  getDistanceBetweenCoordinates,
} from '@/utils/get-distance-between-coordinates';
import { MaxDistanceError } from '@/usecase/errors/max-distance-error';
import { MaxNumberOfCheckInsError } from '@/usecase/errors/max-number-of-check-ins-error';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}
  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);
    if (!gym) {
      throw new ResourceNotFoundError();
    }

    //Calculate the distance from the user and gym
    const userCoordinates: Coordinate = { latitude: userLatitude, longitude: userLongitude };
    const gymCoordinates: Coordinate = {
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    };

    const distance = getDistanceBetweenCoordinates(userCoordinates, gymCoordinates);

    const MAX_DISTANCE_IN_KM = 0.1; // 100m

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInsRepository.create({ gym_id: gymId, user_id: userId });
    return { checkIn };
  }
}
