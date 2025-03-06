import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { FetchUserCheckinsHistoryUseCase } from '@/usecase/fetch-user-check-ins-history';

export function makeFetchUserCheckinsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();

  const useCase = new FetchUserCheckinsHistoryUseCase(checkInsRepository);
  return useCase;
}
