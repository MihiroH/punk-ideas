import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { PRISMA_CLIENT_ERROR_CODE } from '@src/prisma/constants/prisma.constant'
import { PrismaService } from '@src/prisma/prisma.service'
import { PendingEmailChange } from './models/pendingEmailChange.model'

@Injectable()
export class PendingEmailChangeService {
  constructor(private prismaService: PrismaService) {}

  async findByUserIdAndToken(userId: number, token: string): Promise<PendingEmailChange | null> {
    return await this.prismaService.client.pendingEmailChange.findFirst({
      where: {
        userId,
        token,
        deletedAt: null,
      },
    })
  }

  async create(userId: number, email: string, token: string): Promise<PendingEmailChange> {
    return await this.prismaService.client.pendingEmailChange.create({
      data: {
        userId,
        email,
        token,
      },
    })
  }

  async update(args: Prisma.PendingEmailChangeUpdateArgs): Promise<PendingEmailChange> {
    try {
      return await this.prismaService.client.pendingEmailChange.update(args)
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

  async softDelete(id: number): Promise<boolean> {
    const deletedPendingEmailChange = await this.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return !!deletedPendingEmailChange
  }
}
