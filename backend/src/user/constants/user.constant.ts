import { Prisma } from '@prisma/client'

import { SORT_ORDER } from '@src/common/constants/sortOrder.constant'
import { UserRelations } from '../models/user.model'

export const FIELD_RELATIONS: Array<{
  field: keyof UserRelations
  relations: Prisma.UserInclude
}> = [
  {
    field: 'ideas',
    relations: {
      ideas: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: SORT_ORDER.desc,
        },
      },
    },
  },
  {
    field: 'ideasCount',
    relations: {
      _count: {
        select: {
          ideas: true,
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
      },
    },
  },
  {
    field: 'commentsCount',
    relations: {
      _count: {
        select: {
          comments: true,
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
