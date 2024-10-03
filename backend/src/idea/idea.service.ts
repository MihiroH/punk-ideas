import { Injectable } from '@nestjs/common'
import { Category, Prisma } from '@prisma/client'

import { SORT_ORDER } from '@src/common/constants/sortOrder.constant'
import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { strictEntries } from '@src/common/helpers/strictEntries.helper'
import { PRISMA_CLIENT_ERROR_CODE } from '@src/prisma/constants/prisma.constant'
import { PrismaService } from '@src/prisma/prisma.service'
import { FIELD_RELATIONS } from './constants/idea.constant'
import { IdeaCreateInput } from './dto/ideaCreate.input'
import { IdeasGetArgs, IdeasGetArgsExtended } from './dto/ideasGet.args'
import { Idea, IdeaRelations } from './models/idea.model'

@Injectable()
export class IdeaService {
  readonly FIELD_RELATIONS = FIELD_RELATIONS
  private readonly COUNT_KEY_FIELD_MAP = {
    comments: 'commentsCount',
    reports: 'reportsCount',
  } as const

  constructor(private prismaService: PrismaService) {}

  formatIdea(idea: Idea): Idea {
    const result = { ...idea }

    if ('ideaCategories' in idea) {
      result.categories = idea.ideaCategories
        ?.map((ideaCategory) => ideaCategory.category)
        .filter((c): c is Category => !!c)
    }

    if (idea._count) {
      for (const [key, value] of strictEntries(idea._count)) {
        const field = this.COUNT_KEY_FIELD_MAP[key]
        result[field] = value
      }
    }

    return result
  }

  async create(data: IdeaCreateInput, authorId: number, authorIp: string): Promise<Idea> {
    const { categoryIds, ...restData } = data
    const resource = await this.prismaService.client.idea.create({
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
      include: {
        ideaCategories: {
          include: {
            category: true,
          },
          orderBy: {
            category: {
              id: SORT_ORDER.asc,
            },
          },
        },
      },
    })

    return this.formatIdea(resource)
  }

  createRelations(fields: Parameters<PrismaService['createRelations']>[0], fieldRelations = this.FIELD_RELATIONS) {
    return this.prismaService.createRelations<'idea', keyof IdeaRelations>(fields, fieldRelations)
  }

  createListOptions(options?: { ideasGetArgs?: IdeasGetArgsExtended; reporterId?: number; authorId?: number }): Omit<
    Prisma.IdeaFindManyArgs,
    'relationLoadStrategy'
  > {
    const { ideasGetArgs, reporterId, authorId } = options ?? {}
    const { title, content, orderBy, includeReportedBySelf, ...restArgs } = ideasGetArgs ?? {}

    return {
      where: {
        authorId,
        title: { contains: title },
        content: { contains: content },
        deletedAt: null,
        reports:
          includeReportedBySelf || reporterId === undefined
            ? undefined
            : {
                none: {
                  reporterId,
                },
              },
        ...restArgs,
      },
      orderBy: this.prismaService.formatOrderBy(orderBy),
    }
  }

  async list(
    args?: { ideasGetArgs?: IdeasGetArgsExtended; reporterId?: number; authorId?: number },
    include?: Prisma.IdeaInclude,
  ): Promise<Idea[]> {
    const resources = await this.prismaService.client.idea.findMany({
      ...this.createListOptions(args),
      include,
    })

    return resources.map((r) => this.formatIdea(r))
  }

  async listByAuthorId(authorId: number, args?: { ideasGetArgs?: IdeasGetArgs }): Promise<Idea[]> {
    const resources = await this.prismaService.client.user
      .findUnique({
        where: {
          id: authorId,
          deletedAt: null,
        },
      })
      .ideas(this.createListOptions(args))

    return resources ?? []
  }

  async count(args?: { ideasGetArgs?: IdeasGetArgsExtended; reporterId?: number; authorId?: number }): Promise<number> {
    const { ideasGetArgs, reporterId, authorId } = args ?? {}
    const { title, content, orderBy, includeReportedBySelf, ...restArgs } = ideasGetArgs ?? {}

    return await this.prismaService.client.idea.count({
      where: {
        authorId,
        title: { contains: title },
        content: { contains: content },
        deletedAt: null,
        reports:
          includeReportedBySelf || reporterId === undefined
            ? undefined
            : {
                none: {
                  reporterId,
                },
              },
        ...restArgs,
      },
      orderBy: this.prismaService.formatOrderBy(orderBy),
    })
  }

  async getById(id: number, include?: Prisma.IdeaInclude): Promise<Idea | null> {
    const resource = await this.prismaService.client.idea.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include,
    })

    return resource ? this.formatIdea(resource) : null
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

  async delete(id: number): Promise<boolean> {
    const deletedIdea = await this.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return !!deletedIdea
  }
}
