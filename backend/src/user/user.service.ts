import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'

import { PrismaService } from '@src/prisma/prisma.service'
import { CreateUserInput } from './dto/createUser.input'
import { GetUserArgs } from './dto/getUser.args'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findOne(getUserArgs: GetUserArgs): Promise<User> {
    const resource = await this.prismaService.user.findUnique({ where: { ...getUserArgs, deletedAt: null } })

    if (!resource) {
      throw new NotFoundException('No User found')
    }

    return resource
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: createUserInput.email },
    })

    if (existingUser) {
      throw new ConflictException('Email already exists')
    }

    const { password, ...restCreateUserInput } = createUserInput
    const hashedPassword = await bcrypt.hash(password, 10)

    return this.prismaService.user.create({
      data: {
        ...restCreateUserInput,
        password: hashedPassword,
      },
    })
  }

  async softDelete(id: number): Promise<void> {
    const resource = await this.prismaService.user.findUnique({ where: { id, deletedAt: null } })

    if (!resource) {
      throw new NotFoundException('No User found')
    }

    await this.prismaService.softDeleteWithRelations('user', id, ['ideas'])
  }
}
