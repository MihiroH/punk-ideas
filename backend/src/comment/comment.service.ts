import { Injectable } from '@nestjs/common'
import { PrismaService } from '@src/prisma/prisma.service'

import { Comment } from './comment.model'
import { CommentCreateInput } from './dto/commentCreate.input'

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
}
