import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { AnswerAttachmentList } from '../answer-attachment-list'

export interface AnswerWithAuthorProps {
  answerId: UniqueEntityID
  questionId: UniqueEntityID
  authorId: UniqueEntityID
  author: string
  content: string
  attachments: AnswerAttachmentList
  createdAt: Date
  updatedAt: Date | null
}

export class AnswerWithAuthor extends ValueObject<AnswerWithAuthorProps> {
  get answerId() {
    return this.props.answerId
  }

  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
  }

  get author() {
    return this.props.author
  }

  get attachments() {
    return this.props.attachments
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: AnswerWithAuthorProps) {
    return new AnswerWithAuthor(props)
  }
}
