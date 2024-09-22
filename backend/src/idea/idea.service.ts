import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { PRISMA_CLIENT_ERROR_CODE } from '@src/prisma/constants/prisma.constant'
import { PrismaService } from '@src/prisma/prisma.service'
import { IdeaCreateInput } from './dto/ideaCreate.input'
import { IdeasGetArgs } from './dto/ideasGet.args'
import { Idea } from './models/idea.model'

@Injectable()
export class IdeaService {
  constructor(private prismaService: PrismaService) {}

  async create(data: IdeaCreateInput, authorId: number, authorIp: string): Promise<Idea> {
    const { categoryIds, ...restData } = data

    return await this.prismaService.client.idea.create({
      data: {
        ...restData,
        authorId,
        authorIp: Buffer.from(authorIp),
        ideaCategories: {
          create: categoryIds?.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
    })
  }

  formatIdea(idea: Idea): Idea {
    return {
      ...idea,
      categories: idea.ideaCategories?.map((category) => category.category),
    }
  }

  async findMany(args?: { ideasGetArgs?: IdeasGetArgs; authorId?: number }, include?: Prisma.IdeaInclude) {
    const { authorId, ideasGetArgs } = args ?? {}
    const { title, content, orderBy, ...restArgs } = ideasGetArgs ?? {}

    const resources = await this.prismaService.client.idea.findMany({
      where: {
        authorId,
        title: { contains: title },
        content: { contains: content },
        deletedAt: null,
        ...restArgs,
      },
      orderBy: this.prismaService.formatOrderBy(orderBy),
      include,
    })

    return resources.map(this.formatIdea)
  }

  async findById(id: number, include?: Prisma.IdeaInclude): Promise<Idea> {
    const resource = await this.prismaService.client.idea.findUniqueOrThrow({
      where: {
        id,
        deletedAt: null,
      },
      include,
    })

    return this.formatIdea(resource)
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
