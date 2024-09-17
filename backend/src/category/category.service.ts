import { Injectable } from '@nestjs/common'
import { PrismaService } from '@src/prisma/prisma.service'

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async getAll() {
    return await this.prismaService.client.category.findMany()
  }
}
