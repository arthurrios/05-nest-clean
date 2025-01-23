import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((answer) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(answer.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID "${answer.authorId.toString()}" does not exist. `,
          )
        }

        const answerAttachments = this.answerAttachmentsRepository.items.filter(
          (answerAttachment) => {
            return answerAttachment.answerId.equals(answer.id)
          },
        )

        const attachments = answerAttachments.map((answerAttachment) => {
          const attachment = this.attachmentsRepository.items.find(
            (attachment) => {
              return attachment.id.equals(answerAttachment.attachmentId)
            },
          )

          if (!attachment) {
            throw new Error(
              `Author with ID "${answerAttachment.attachmentId.toString()}" does not exist. `,
            )
          }

          return attachment
        })

        return AnswerDetails.create({
          answerId: answer.id,
          questionId: answer.questionId,
          authorId: answer.authorId,
          author: author.name,
          content: answer.content,
          attachments,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        })
      })

    return answers
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[itemIndex] = answer

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(itemIndex, 1)

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
}
