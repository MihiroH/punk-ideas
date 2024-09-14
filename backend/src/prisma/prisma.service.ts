import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

import { SORT_ORDER, VSortOrders } from '@src/common/constants/sortOrder.constant'
import { OrderByInput } from '@src/common/dto/orderBy.args'
import { ResourceNotFoundException } from '@src/common/libs/errors/resourceNotFound.exception'
import { CamelCase } from '@src/common/types/string.type'
import { PRISMA_CLIENT_ERROR_CODE } from './constants/prisma.constant'

type ModelDelegateForUpdate = PrismaClient[keyof PrismaClient] & {
  update(args: { where: { id: number }; data: object }): Prisma.PrismaPromise<unknown>
}
type ModelName = keyof Prisma.TypeMap['model']
type CamelCasedModelName = CamelCase<ModelName>
type Relations<T extends ModelName> = keyof Prisma.TypeMap['model'][T]['payload']['objects']

const defaultOrderBy = {
  createdAt: SORT_ORDER.desc,
}

// NOTE: PrismaService extends PrismaClientとした方が合理的だが、
//       get client()で返すthisが"user"や"idea"を持たなくなるため、PrismaClientのインスタンス化を独自で行う
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prismaClient: PrismaClient
  private transactionClient: Prisma.TransactionClient = null

  constructor() {
    this.prismaClient = new PrismaClient()
  }

  async onModuleInit() {
    await this.prismaClient.$connect()
  }

  async onModuleDestroy() {
    await this.prismaClient.$disconnect()
  }

  // トランザクションを開始し、専用の Prisma インスタンスを設定する
  async runTransaction<T>(callback: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prismaClient.$transaction(async (prisma) => {
      this.transactionClient = prisma

      try {
        const result = await callback(prisma)
        this.transactionClient = null
        return result
      } catch (error) {
        this.transactionClient = null
        throw error
      }
    })
  }

  // トランザクション中なら専用インスタンスを返す。そうでなければ通常のインスタンスを返す
  get client(): Prisma.TransactionClient | PrismaClient {
    return this.transactionClient ?? this.prismaClient
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
      acc[String(relation)] = {
        updateMany: {
          where: { deletedAt: null },
          data: { deletedAt: new Date() },
        },
      }
      return acc
    }, {})

    const modelDelegate: ModelDelegateForUpdate = this.client[modelName]

    try {
      return await modelDelegate.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          ...relationsQuery,
        },
      })
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
}
