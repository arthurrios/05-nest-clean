import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author'

export class AnswerWithAuthorPresenter {
  static toHTTP(answerWithAuthor: AnswerWithAuthor) {
    return {
      id: answerWithAuthor.answerId.toString(),
      questionId: answerWithAuthor.questionId.toString(),
      authorId: answerWithAuthor.authorId.toString(),
      authorName: answerWithAuthor.author,
      content: answerWithAuthor.content,
      attachments: answerWithAuthor.attachments,
      createdAt: answerWithAuthor.createdAt,
      updatedAt: answerWithAuthor.updatedAt,
    }
  }
}
