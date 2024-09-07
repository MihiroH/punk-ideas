import { Injectable, NotFoundException } from '@nestjs/common'
import { PendingEmailChange } from '@prisma/client'
import { PrismaService } from '@src/prisma/prisma.service'

@Injectable()
export class PendingEmailChangeService {
  constructor(private prismaService: PrismaService) {}

  async findOneByUserIdAndToken(userId: number, token: string): Promise<PendingEmailChange> {
    const resource = await this.prismaService.client.pendingEmailChange.findFirst({
      where: {
        userId,
        token,
        deletedAt: null,
      },
    })

    return resource
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

  async softDelete(id: number): Promise<void> {
    const resource = await this.prismaService.client.pendingEmailChange.findUnique({ where: { id, deletedAt: null } })

    if (!resource) {
      throw new NotFoundException('No Pending-Email-Change found')
    }

    await this.prismaService.client.pendingEmailChange.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
