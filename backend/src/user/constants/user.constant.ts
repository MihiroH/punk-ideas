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
        include: {
          author: true,
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
          favorites: {
            where: {
              // 利用するときにuserIdを置換する処理が必要
              userId: '%userId%' as unknown as number,
            },
          },
          _count: {
            select: {
              comments: {
                where: {
                  deletedAt: null,
                },
              },
              favorites: {
                where: {
                  idea: {
                    deletedAt: null,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    field: 'ideasCount',
    relations: {
      _count: {
        select: {
          ideas: {
            where: {
              deletedAt: null,
            },
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
  {
    field: 'favoriteIdeas',
    relations: {
      ideaFavorites: {
        include: {
          idea: {
            include: {
              author: true,
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
              _count: {
                select: {
                  comments: {
                    where: {
                      deletedAt: null,
                    },
                  },
                  favorites: {
                    where: {
                      idea: {
                        deletedAt: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          idea: {
            deletedAt: null,
          },
        },
        orderBy: {
          idea: {
            createdAt: SORT_ORDER.desc,
          },
        },
      },
    },
  },
  {
    field: 'favoriteIdeasCount',
    relations: {
      _count: {
        select: {
          ideaFavorites: {
            where: {
              idea: {
                deletedAt: null,
              },
            },
          },
        },
      },
    },
  },
]
