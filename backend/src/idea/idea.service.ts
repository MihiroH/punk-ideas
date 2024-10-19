import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { Category } from '@src/category/models/category.model'
import { SORT_ORDER } from '@src/common/constants/sortOrder.constant'
import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { deepMergeObjects } from '@src/common/helpers/deepMergeObjects.helper'
import { strictEntries } from '@src/common/helpers/strictEntries.helper'
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
    favorites: 'favoritesCount',
  } as const

  constructor(private prismaService: PrismaService) {}

  formatIdea(idea: Idea): Idea {
    const result = { ...idea }

    if (idea.ideaCategories) {
      result.categories = idea.ideaCategories
        .map((ideaCategory) => ideaCategory.category)
        .filter((category): category is Category => !!category)
    }

    if (idea.favorites) {
      result.isMyFavorite = !!idea.favorites.length
    }

    if (idea.comments) {
      result.comments = idea.comments.map((comment) => ({
        ...comment,
        favoritesCount: comment._count?.favorites,
        isMyFavorite: !!comment.favorites?.length,
      }))
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

  createRelations(
    fields: Parameters<PrismaService['createRelations']>[0],
    fieldRelations = this.FIELD_RELATIONS,
    userId?: number,
  ) {
    const newFieldRelations = [...fieldRelations]
    const relationOfIsMyFavorite = this.FIELD_RELATIONS.find((relation) => relation.field === 'isMyFavorite')

    if (relationOfIsMyFavorite) {
      const fieldRelation = deepMergeObjects(
        [
          relationOfIsMyFavorite,
          {
            field: relationOfIsMyFavorite.field,
            relations: {
              favorites: userId === undefined ? undefined : { where: { userId } },
            },
          },
        ],
        { deleteIfUndefinedIsSpecified: true },
      )
      newFieldRelations.push(fieldRelation)
    }

    const relationOfIsMyFavoriteInComment = this.FIELD_RELATIONS.find((relation) => relation.field === 'comments')

    if (relationOfIsMyFavoriteInComment) {
      const fieldRelation = deepMergeObjects(
        [
          relationOfIsMyFavoriteInComment,
          {
            field: relationOfIsMyFavoriteInComment.field,
            relations: {
              comments: {
                include: {
                  favorites: userId === undefined ? undefined : { where: { userId } },
                },
              },
            },
          },
        ],
        { deleteIfUndefinedIsSpecified: true },
      )
      newFieldRelations.push(fieldRelation)
    }

    return this.prismaService.createRelations<'idea', keyof IdeaRelations>(fields, newFieldRelations)
  }

  async list(
    args?: { ideasGetArgs?: IdeasGetArgs; reporterId?: number },
    include?: Prisma.IdeaInclude,
  ): Promise<Idea[]> {
    const { ideasGetArgs, reporterId } = args ?? {}
    const { title, content, orderBy, includeReportedBySelf, ...restArgs } = ideasGetArgs ?? {}

    const resources = await this.prismaService.client.idea.findMany({
      where: {
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
      include,
    })

    return resources.map((r) => this.formatIdea(r))
  }

  async count(args?: { ideasGetArgs?: IdeasGetArgs; reporterId?: number }): Promise<number> {
    const { reporterId, ideasGetArgs } = args ?? {}
    const { title, content, orderBy, includeReportedBySelf, ...restArgs } = ideasGetArgs ?? {}

    return await this.prismaService.client.idea.count({
      where: {
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
