import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

interface ValidateCheckInsUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInsUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInsUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository
  ) { }

  async execute({
    checkInId
  }: ValidateCheckInsUseCaseRequest): Promise<ValidateCheckInsUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })
    return { checkIn }
  }
}
