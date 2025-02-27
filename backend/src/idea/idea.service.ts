import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { Category } from '@src/category/category.model'
import { SORT_ORDER } from '@src/common/constants/sortOrder.constant'
import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { deepMergeObjects } from '@src/common/helpers/deepMergeObjects.helper'
import { strictEntries } from '@src/common/helpers/strictEntries.helper'
import { PRISMA_CLIENT_ERROR_CODE } from '@src/prisma/constants/prisma.constant'
import { PrismaService } from '@src/prisma/prisma.service'
import { FIELD_RELATIONS } from './constants/idea.constant'
import { IdeaCreateInput } from './dto/ideaCreate.input'
import { IdeasCountArgs } from './dto/ideasCount.args'
import { IdeasGetArgs } from './dto/ideasGet.args'
import { Idea, IdeaConnection, IdeaRelations } from './idea.model'

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

    if (idea.ideaFiles) {
      result.files = idea.ideaFiles
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
    const { categoryIds, filePaths, ...restData } = data
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
        ideaFiles: {
          create: filePaths?.map((filePath) => ({
            filePath,
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
        ideaFiles: true,
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
        { deleteUndefinedProps: true },
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
        { deleteUndefinedProps: true },
      )
      newFieldRelations.push(fieldRelation)
    }

    return this.prismaService.createRelations<'idea', keyof IdeaRelations>(fields, newFieldRelations)
  }

  async list(
    args?: { ideasGetArgs?: IdeasGetArgs; reporterId?: number },
    include?: Prisma.IdeaInclude,
  ): Promise<IdeaConnection> {
    const { ideasGetArgs, reporterId } = args ?? {}
    const { title, content, orderBy, includeReportedBySelf, first, after, last, before, ...restArgs } =
      ideasGetArgs ?? {}

    const cursorOptions = this.prismaService.buildCursorOptions({ first, after, last, before })
    const formattedOrderBy = this.prismaService.formatOrderBy(orderBy)

    // 次のページがあるかどうかを判断するため、1つ多めに取得
    const take = cursorOptions.take
      ? cursorOptions.take > 0
        ? cursorOptions.take + 1
        : cursorOptions.take - 1
      : undefined

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
      orderBy: formattedOrderBy,
      include,
      ...cursorOptions,
      take,
    })

    const hasMore = !!take && resources.length > Math.abs(take ?? 0) - 1
    if (hasMore) {
      resources.pop() // 余分に取得した分を削除
    }

    const formattedResources = resources.map((r) => this.formatIdea(r))
    const edges = formattedResources.map((node) => ({
      cursor: this.prismaService.encodeCursor(node.id),
      node,
    }))

    if (last) {
      edges.reverse()
    }

    const {
      orderBy: _orderBy,
      first: _first,
      after: _after,
      last: _last,
      before: _before,
      ...ideasCountArgs
    } = ideasGetArgs ?? {}
    const totalCount = await this.count({ ideasCountArgs, reporterId })

    return {
      edges,
      pageInfo: {
        hasNextPage: last ? false : hasMore,
        hasPreviousPage: first ? false : hasMore,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      },
      totalCount,
    }
  }

  async count(args?: { ideasCountArgs?: IdeasCountArgs; reporterId?: number }): Promise<number> {
    const { reporterId, ideasCountArgs } = args ?? {}
    const { title, content, includeReportedBySelf, ...restArgs } = ideasCountArgs ?? {}

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
