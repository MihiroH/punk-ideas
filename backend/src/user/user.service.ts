import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'

import { ResourceNotFoundException } from '@src/common/libs/errors/resourceNotFound.exception'
import { PRISMA_CLIENT_ERROR_CODE } from '@src/prisma/constants/prisma.constant'
import { PrismaService } from '@src/prisma/prisma.service'
import { CreateUserInput } from './dto/createUser.input'
import { UpdateUserProfileInput } from './dto/updateUser.input'
import { EmailAlreadyExistsException } from './errors/emailAlreadyExists.exception'
import { User } from './models/user.model'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string, excludeDeleted = true): Promise<User> {
    return await this.prismaService.client.user.findUnique({
      where: {
        email,
        deletedAt: excludeDeleted ? null : undefined,
      },
    })
  }

  async findById(id: number): Promise<User> {
    return await this.prismaService.client.user.findUniqueOrThrow({
      where: { id, deletedAt: null },
      include: { ideas: { where: { deletedAt: null } } },
    })
  }

  async create(data: CreateUserInput): Promise<User> {
    if (await this.isEmailExists(data.email)) {
      throw new EmailAlreadyExistsException()
    }

    const { password, ...restData } = data
    const hashedPassword = await bcrypt.hash(password, 10)

    return this.prismaService.client.user.create({
      data: {
        ...restData,
        password: hashedPassword,
      },
    })
  }

  async update(args: Prisma.UserUpdateArgs): Promise<User> {
    try {
      return await this.prismaService.client.user.update(args)
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

  async updateProfile(id: number, data: UpdateUserProfileInput): Promise<User> {
    return await this.update({ where: { id }, data })
  }

  async updateEmail(id: number, newEmail: string): Promise<User> {
    if (await this.isEmailExists(newEmail)) {
      throw new EmailAlreadyExistsException()
    }

    return await this.update({ where: { id }, data: { email: newEmail } })
  }

  async isEmailExists(email: string): Promise<boolean> {
    return !!(await this.findByEmail(email, false))
  }

  async verify(id: number): Promise<boolean> {
    const newUser = await this.update({
      where: { id },
      data: { emailVerifiedAt: new Date() },
    })

    return newUser.emailVerifiedAt !== null
  }

  async verifyAndChangeEmail(id: number, newEmail: string): Promise<boolean> {
    const newUser = await this.update({
      where: { id },
      data: { email: newEmail, emailVerifiedAt: new Date() },
    })

    return newUser.email === newEmail && newUser.emailVerifiedAt !== null
  }

  async softDeleteWithRelations(id: number): Promise<boolean> {
    const deletedResources = await this.prismaService.softDeleteWithRelations('user', id, ['ideas', 'comments'])

    return !!deletedResources
  }
}
