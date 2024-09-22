import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

import { SORT_ORDER, VSortOrders } from '@src/common/constants/sortOrder.constant'
import { OrderByArgs } from '@src/common/dto/orderBy.args'
import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { deepMergeObjects } from '@src/common/helpers/deepMergeObjects.helper'
import { PRISMA_CLIENT_ERROR_CODE } from './constants/prisma.constant'
import { CamelCasedModelName, ModelDelegateForUpdate, PrismaInclude, Relations } from './types/prisma.type'

const defaultOrderBy = {
  createdAt: SORT_ORDER.desc,
}

// NOTE: PrismaService extends PrismaClientとした方が合理的だが、
//       get client()で返すthisが"user"や"idea"を持たなくなるため、PrismaClientのインスタンス化を独自で行う
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prismaClient: PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  private transactionClient: Prisma.TransactionClient = null
  private logger: Logger

  constructor() {
    this.prismaClient = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
    this.logger = new Logger(PrismaService.name)
  }

  async onModuleInit() {
    // TODO: ログをファイルに書き込む
    // @see: https://chatgpt.com/share/66e535ae-79b8-8003-9c0b-25902cce3a7f
    this.prismaClient.$on('query', (event: Prisma.QueryEvent) => {
      this.logger.log(`Query: ${event.query}`, `Params: ${event.params}`, `Duration: ${event.duration} ms`)
    })
    this.prismaClient.$on('info', (event) => {
      this.logger.log(`message: ${event.message}`)
    })
    this.prismaClient.$on('error', (event) => {
      this.logger.log(`error: ${event.message}`)
    })
    this.prismaClient.$on('warn', (event) => {
      this.logger.log(`warn: ${event.message}`)
    })

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

  formatOrderBy(orderBy: OrderByArgs | OrderByArgs[], initialOrderBy: Record<string, VSortOrders> = defaultOrderBy) {
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

  createRelations<ModelName extends CamelCasedModelName, FieldNames extends string>(
    fields: string[],
    fieldRelations: Array<{ field: FieldNames; relations: PrismaInclude<ModelName> }>,
  ): PrismaInclude<ModelName> {
    const filteredFields = fieldRelations.filter((item) => fields.includes(item.field)).map((item) => item.field)
    const relations = filteredFields.reduce(
      (acc, field: FieldNames) => {
        // fieldに対応するrelationsを取得するが、同じfieldのrelationsが複数ある場合は最後のものを取得する
        const relations = fieldRelations
          .slice()
          .reverse()
          .find((item) => item.field === field)?.relations

        // NOTE: relationsの_countが複数ある場合は全て結合したいため、deepMergeObjectsを使う
        return deepMergeObjects([acc, relations])
      },
      {} as PrismaInclude<ModelName>,
    )

    return relations
  }

  async softDeleteWithRelations<ModelName extends CamelCasedModelName = CamelCasedModelName>(
    modelName: ModelName,
    id: number,
    relations: Relations<Capitalize<ModelName>>[],
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
