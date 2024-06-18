import { Injectable, NotFoundException } from '@nestjs/common'
import { Idea } from '@prisma/client'
import { PrismaService } from '@src/prisma/prisma.service'

import { CreateIdeaInput } from './dto/createIdea.input'

@Injectable()
export class IdeaService {
  constructor(private prismaService: PrismaService) {}

  async getIdeas(): Promise<Idea[]> {
    return await this.prismaService.idea.findMany({ where: { deletedAt: null } })
  }

  async getIdea(id: number): Promise<Idea> {
    return await this.prismaService.idea.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        author: true,
      },
    })
  }

  async createIdea(createIdeaInput: CreateIdeaInput, authorIp: string): Promise<Idea> {
    const { authorId, ...restCreateIdeaInput } = createIdeaInput

    return await this.prismaService.idea.create({
      data: {
        ...restCreateIdeaInput,
        authorIp: Buffer.from(authorIp),
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    })
  }

  async deleteIdea(id: number): Promise<void> {
    const resource = await this.prismaService.idea.findUnique({ where: { id, deletedAt: null } })
    if (!resource) {
      throw new NotFoundException('Resource not found')
    }

    await this.prismaService.idea.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
