import { Injectable, NotFoundException } from '@nestjs/common'
import { Idea, Prisma } from '@prisma/client'
import { PrismaService } from '@src/prisma/prisma.service'

import { CreateIdeaInput } from './dto/createIdea.input'
import { GetIdeasArgs } from './dto/getIdeas.args'

@Injectable()
export class IdeaService {
  constructor(private prismaService: PrismaService) {}

  async findMany(args?: { getIdeasArgs?: GetIdeasArgs; authorId?: number }): Promise<Idea[]> {
    const { authorId, getIdeasArgs } = args ?? {}
    const { orderBy, title, content, ...restFilter } = getIdeasArgs ?? {}

    const queryOptions: Prisma.IdeaFindManyArgs = {
      where: {
        title: { contains: title },
        content: { contains: content },
        deletedAt: null,
        ...restFilter,
        authorId,
      },
      orderBy: this.prismaService.formatOrderBy(orderBy),
      include: {
        author: true,
      },
    }

    return await this.prismaService.client.idea.findMany(queryOptions)
  }

  async findOne(id: number): Promise<Idea> {
    const resource = await this.prismaService.client.idea.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        author: true,
      },
    })

    if (!resource) {
      throw new NotFoundException('No Idea found')
    }

    return resource
  }

  async create(createIdeaInput: CreateIdeaInput, authorId: number, authorIp: string): Promise<Idea> {
    return await this.prismaService.client.idea.create({
      data: {
        ...createIdeaInput,
        authorId,
        authorIp: Buffer.from(authorIp),
      },
    })
  }

  async softDelete(id: number): Promise<void> {
    const resource = await this.prismaService.client.idea.findUnique({ where: { id, deletedAt: null } })

    if (!resource) {
      throw new NotFoundException('No Idea found')
    }

    await this.prismaService.client.idea.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
