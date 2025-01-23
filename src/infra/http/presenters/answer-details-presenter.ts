import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'
import { AttachmentPresenter } from './attachment-presenter'

export class AnswerWithAuthorPresenter {
  static toHTTP(answerWithAuthor: AnswerDetails) {
    return {
      questionId: answerWithAuthor.questionId.toString(),
      authorId: answerWithAuthor.authorId.toString(),
      authorName: answerWithAuthor.author,
      content: answerWithAuthor.content,
      attachments: answerWithAuthor.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: answerWithAuthor.createdAt,
      updatedAt: answerWithAuthor.updatedAt,
    }
  }
}
