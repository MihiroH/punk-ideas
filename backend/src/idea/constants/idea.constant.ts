import { Prisma } from '@prisma/client'

import { SORT_ORDER } from '@src/common/constants/sortOrder.constant'
import { IdeaRelations } from '../models/idea.model'

export const OPEN_LEVELS = {
  private: 0,
  public: 1,
} as const

export const FIELD_RELATIONS: Array<{
  field: keyof IdeaRelations
  relations: Prisma.IdeaInclude
}> = [
  {
    field: 'author',
    relations: {
      author: true,
    },
  },
  {
    field: 'categories',
    relations: {
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
  },
  {
    field: 'comments',
    relations: {
      comments: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: SORT_ORDER.desc,
        },
        include: {
          author: true,
        },
      },
    },
  },
  {
    field: 'commentsCount',
    relations: {
      _count: {
        select: {
          comments: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
  },
  {
    field: 'reportsCount',
    relations: {
      _count: {
        select: {
          reports: true,
        },
      },
    },
  },
]
