import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { SORT_ORDER, VSortOrders } from '@src/common/constants/sortOrder.constant'
import { OrderByInput } from '@src/common/dto/orderBy.args'

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
}
