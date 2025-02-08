import { Injectable } from '@nestjs/common'

import { PrismaService } from '@src/prisma/prisma.service'
import { CommentFavorite } from './commentFavorite.model'

@Injectable()
export class CommentFavoriteService {
  constructor(private prismaService: PrismaService) {}

  async create(commentId: number, userId: number): Promise<CommentFavorite> {
    return await this.prismaService.client.commentFavorite.create({
      data: {
        commentId,
        userId,
      },
    })
  }

  async delete(commentId: number, userId: number): Promise<boolean> {
    const deletedCommentFavorite = await this.prismaService.client.commentFavorite.delete({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    })

    return !!deletedCommentFavorite
  }
}
