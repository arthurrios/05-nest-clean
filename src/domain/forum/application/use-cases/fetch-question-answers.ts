import { right, type Either } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { Injectable } from '@nestjs/common'
import { AnswerDetails } from '../../enterprise/entities/value-objects/answer-details'

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  { answers: AnswerDetails[] }
>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionIdWithAuthor(
      questionId,
      { page },
    )

    return right({ answers })
  }
}
