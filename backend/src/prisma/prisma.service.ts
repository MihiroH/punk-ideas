import { Injectable, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

import { SORT_ORDER, VSortOrders } from '@src/common/constants/sortOrder.constant'
import { OrderByInput } from '@src/common/dto/orderBy.args'
import { CamelCase } from '@src/common/types/string.type'

type ModelDelegateForUpdate = PrismaClient[keyof PrismaClient] & {
  update(args: { where: { id: number }; data: object }): Prisma.PrismaPromise<unknown>
}

type ModelName = keyof Prisma.TypeMap['model']
type CamelCasedModelName = CamelCase<ModelName>
type Relations<T extends ModelName> = keyof Prisma.TypeMap['model'][T]['payload']['objects']

const defaultOrderBy = {
  createdAt: SORT_ORDER.desc,
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  formatOrderBy(orderBy: OrderByInput | OrderByInput[], initialOrderBy: Record<string, VSortOrders> = defaultOrderBy) {
    if (!orderBy) {
      return initialOrderBy
    }

    if (Array.isArray(orderBy)) {
      return orderBy.reduce((acc, { field, order }) => {
        acc.push({ [field]: order })
        return acc
      }, [])
    }

    return {
      [orderBy.field]: orderBy.order,
    }
  }

  async softDeleteWithRelations<T extends CamelCasedModelName = CamelCasedModelName>(
    modelName: T,
    id: number,
    relations: Relations<Capitalize<T>>[],
  ) {
    const relationsQuery = relations.reduce((acc, relation) => {
      acc[relation as string] = {
        updateMany: {
          where: { deletedAt: null },
          data: { deletedAt: new Date() },
        },
      }
      return acc
    }, {})

    const modelDelegate: ModelDelegateForUpdate = this[modelName]

    return await modelDelegate.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        ...relationsQuery,
      },
    })
  }
}
