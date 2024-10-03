import { Injectable } from '@nestjs/common'
import { PrismaService } from '@src/prisma/prisma.service'

import { SORT_ORDER } from '@src/common/constants/sortOrder.constant'
import { CommentCreateInput } from './dto/commentCreate.input'
import { Comment } from './models/comment.model'

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async create(commentCreateInput: CommentCreateInput, authorId: number, authorIp: string): Promise<Comment> {
    return await this.prismaService.client.comment.create({
      data: {
        ...commentCreateInput,
        authorId,
        authorIp: Buffer.from(authorIp),
      },
    })
  }

  async listByIdeaId(ideaId: number): Promise<Comment[]> {
    const resources = await this.prismaService.client.idea
      .findUnique({
        where: {
          id: ideaId,
        },
      })
      .comments({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: SORT_ORDER.desc,
        },
      })

    return resources ?? []
  }
}
