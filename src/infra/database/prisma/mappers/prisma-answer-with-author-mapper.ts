import {
  Answer as PrismaAnswer,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

type PrismaAnswerWithAuthor = PrismaAnswer & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaAnswerWithAuthorMapper {
  static toAttachment(raw: PrismaAttachment): AnswerAttachment {
    return AnswerAttachment.create({
      answerId: new UniqueEntityID(raw.answerId),
      attachmentId: new UniqueEntityID(raw.id),
    })
  }

  static toDomain(raw: PrismaAnswerWithAuthor): AnswerWithAuthor {
    const attachments = new AnswerAttachmentList(
      raw.attachments.map((attachment) => {
        if (!attachment) {
          return null
        }
        return this.toAttachment(attachment)
      }),
    )

    return AnswerWithAuthor.create({
      answerId: new UniqueEntityID(raw.id),
      questionId: new UniqueEntityID(raw.questionId),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      attachments,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
