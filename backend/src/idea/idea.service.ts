import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { ResourceNotFoundException } from '@src/common/libs/errors/resourceNotFound.exception'
import { PRISMA_CLIENT_ERROR_CODE } from '@src/prisma/constants/prisma.constant'
import { PrismaService } from '@src/prisma/prisma.service'
import { CreateIdeaInput } from './dto/createIdea.input'
import { GetIdeasArgs } from './dto/getIdeas.args'
import { Idea } from './models/idea.model'

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

  async findById(id: number): Promise<Idea> {
    return await this.prismaService.client.idea.findUniqueOrThrow({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        author: true,
      },
    })
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

  async update(args: Prisma.IdeaUpdateArgs): Promise<Idea> {
    try {
      return await this.prismaService.client.idea.update(args)
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_CLIENT_ERROR_CODE.recordsNotFound
      ) {
        throw new ResourceNotFoundException(error.message)
      }

      throw error
    }
  }

  async softDelete(id: number): Promise<boolean> {
    const deletedIdea = await this.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return !!deletedIdea
  }
}
