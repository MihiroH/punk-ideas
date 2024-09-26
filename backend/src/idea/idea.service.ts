import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { PRISMA_CLIENT_ERROR_CODE } from '@src/prisma/constants/prisma.constant'
import { PrismaService } from '@src/prisma/prisma.service'
import { FIELD_RELATIONS } from './constants/idea.constant'
import { IdeaCreateInput } from './dto/ideaCreate.input'
import { IdeasGetArgs } from './dto/ideasGet.args'
import { Idea, IdeaRelations } from './models/idea.model'

@Injectable()
export class IdeaService {
  readonly FIELD_RELATIONS = FIELD_RELATIONS
  private readonly COUNT_KEY_FIELD_MAP = {
    comments: 'commentsCount',
    reports: 'reportsCount',
  }

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

  createRelations(fields: Parameters<PrismaService['createRelations']>[0], fieldRelations = this.FIELD_RELATIONS) {
    return this.prismaService.createRelations<'idea', keyof IdeaRelations>(fields, fieldRelations)
  }

  formatIdea(idea: Idea | null): Idea | null {
    if (!idea) {
      return null
    }

    const result = { ...idea }

    if ('ideaCategories' in idea) {
      result.categories = idea.ideaCategories?.map((category) => category.category) ?? null
    }

    if (idea._count) {
      for (const [key, value] of Object.entries(idea._count)) {
        const field = this.COUNT_KEY_FIELD_MAP[key]
        result[field] = value
      }
    }

    return result
  }

  async findMany(
    args?: { ideasGetArgs?: IdeasGetArgs; userId?: number },
    include?: Prisma.IdeaInclude,
  ): Promise<Idea[]> {
    const { ideasGetArgs, userId } = args ?? {}
    const { title, content, orderBy, includeReportedBySelf, ...restArgs } = ideasGetArgs ?? {}

    const resources = await this.prismaService.client.idea.findMany({
      where: {
        title: { contains: title },
        content: { contains: content },
        deletedAt: null,
        reports:
          includeReportedBySelf || userId === undefined
            ? undefined
            : {
                none: {
                  reporterId: userId,
                },
              },
        ...restArgs,
      },
      orderBy: this.prismaService.formatOrderBy(orderBy),
      include,
    })

    return resources.map((r) => this.formatIdea(r))
  }

  async count(args?: { ideasGetArgs?: IdeasGetArgs; userId?: number }): Promise<number> {
    const { userId, ideasGetArgs } = args ?? {}
    const { title, content, orderBy, includeReportedBySelf, ...restArgs } = ideasGetArgs ?? {}

    return await this.prismaService.client.idea.count({
      where: {
        title: { contains: title },
        content: { contains: content },
        deletedAt: null,
        reports:
          includeReportedBySelf || userId === undefined
            ? undefined
            : {
                none: {
                  reporterId: userId,
                },
              },
        ...restArgs,
      },
      orderBy: this.prismaService.formatOrderBy(orderBy),
    })
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
