import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'

import { PrismaService } from '@src/prisma/prisma.service'
import { CreateUserInput } from './dto/createUser.input'
import { UpdateUserInput } from './dto/updateUser.input'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findOneByEmail(email: string, excludeDeleted = true): Promise<User> {
    const resource = await this.prismaService.user.findUnique({
      where: {
        email,
        deletedAt: excludeDeleted ? null : undefined,
      },
    })

    return resource
  }

  async findOneById(id: number): Promise<User> {
    const resource = await this.prismaService.user.findUnique({ where: { id, deletedAt: null } })

    if (!resource) {
      throw new NotFoundException('No User found')
    }

    return resource
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    const existingUser = await this.findOneByEmail(createUserInput.email, false)

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

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    const resource = await this.findOneById(id)

    if (!resource) {
      throw new NotFoundException('No User found')
    }

    return this.prismaService.user.update({ where: { id }, data: updateUserInput })
  }

  async verify(id: number) {
    const resource = await this.findOneById(id)

    if (!resource) {
      throw new NotFoundException('No User found')
    }

    const newUser = await this.prismaService.user.update({
      where: { id },
      data: { emailVerifiedAt: new Date() },
    })

    return newUser.emailVerifiedAt !== null
  }

  async softDelete(id: number): Promise<void> {
    const resource = await this.findOneById(id)

    if (!resource) {
      throw new NotFoundException('No User found')
    }

    await this.prismaService.softDeleteWithRelations('user', id, ['ideas'])
  }
}
