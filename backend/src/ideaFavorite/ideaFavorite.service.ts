import { Injectable } from '@nestjs/common'

import { PrismaService } from '@src/prisma/prisma.service'
import { IdeaFavorite } from './models/ideaFavorite.model'

@Injectable()
export class IdeaFavoriteService {
  constructor(private prismaService: PrismaService) {}

  async create(ideaId: number, userId: number): Promise<IdeaFavorite> {
    return await this.prismaService.client.ideaFavorite.create({
      data: {
        ideaId,
        userId,
      },
    })
  }

  async delete(ideaId: number, userId: number): Promise<boolean> {
    const deletedIdeaFavorite = await this.prismaService.client.ideaFavorite.delete({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
    })

    return !!deletedIdeaFavorite
  }
}
