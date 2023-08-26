import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ValidateCheckInsUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInsUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInsUseCaseRequest): Promise<ValidateCheckInsUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)
    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()
    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
