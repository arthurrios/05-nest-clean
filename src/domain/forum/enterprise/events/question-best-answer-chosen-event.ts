import type { DomainEvent } from '@/core/events/domain-event'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Question } from '../entities/question'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public occurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityID

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question
    this.occurredAt = new Date()
    this.bestAnswerId = bestAnswerId
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
