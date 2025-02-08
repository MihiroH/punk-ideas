import { Injectable } from '@nestjs/common'

import { PrismaService } from '@src/prisma/prisma.service'

@Injectable()
export class IdeaFileService {
  constructor(private prismaService: PrismaService) {}

  // async create(ideaId: number, userId: number): Promise<IdeaFile> {
  //   return await this.prismaService.client.ideaFile.create({
  //     data: {
  //       ideaId,
  //       userId,
  //     },
  //   })
  // }

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
