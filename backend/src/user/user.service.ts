import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'

import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { strictEntries } from '@src/common/helpers/strictEntries.helper'
import { PRISMA_CLIENT_ERROR_CODE } from '@src/prisma/constants/prisma.constant'
import { PrismaService } from '@src/prisma/prisma.service'
import { FIELD_RELATIONS } from './constants/user.constant'
import { UserCreateInput } from './dto/userCreate.input'
import { UserProfileUpdateInput } from './dto/userProfileUpdate.input'
import { EmailAlreadyExistsException } from './errors/emailAlreadyExists.exception'
import { User, UserRelations } from './models/user.model'

@Injectable()
export class UserService {
  readonly FIELD_RELATIONS = FIELD_RELATIONS
  private readonly COUNT_KEY_FIELD_MAP = {
    ideas: 'ideasCount',
    comments: 'commentsCount',
    reports: 'reportsCount',
  } as const

  constructor(private prismaService: PrismaService) {}

  createRelations(fields: Parameters<PrismaService['createRelations']>[0], fieldRelations = this.FIELD_RELATIONS) {
    return this.prismaService.createRelations<'idea', keyof UserRelations>(fields, fieldRelations)
  }

  formatUser(user: User): User {
    const result = { ...user }

    if (user._count) {
      for (const [key, value] of strictEntries(user._count)) {
        const field = this.COUNT_KEY_FIELD_MAP[key]
        result[field] = value
      }
    }

    return result
  }

  async getByEmail(email: string, includeDeleted = false, include?: Prisma.UserInclude): Promise<User | null> {
    const resource = await this.prismaService.client.user.findUnique({
      where: {
        email,
        deletedAt: includeDeleted ? undefined : null,
      },
      include,
    })

    return resource ? this.formatUser(resource) : null
  }

  async getById(id: number, include?: Prisma.UserInclude): Promise<User | null> {
    const resource = await this.prismaService.client.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include,
    })

    return resource ? this.formatUser(resource) : null
  }

  async create(data: UserCreateInput): Promise<User> {
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

  async updateProfile(id: number, data: UserProfileUpdateInput): Promise<User> {
    return await this.update({ where: { id }, data })
  }

  async updateEmail(id: number, newEmail: string): Promise<User> {
    if (await this.isEmailExists(newEmail)) {
      throw new EmailAlreadyExistsException()
    }

    return await this.update({ where: { id }, data: { email: newEmail } })
  }

  async isEmailExists(email: string): Promise<boolean> {
    const user = await this.getByEmail(email, true)
    return !!user
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

  async deleteWithRelations(id: number): Promise<boolean> {
    const deletedResources = await this.prismaService.softDeleteWithRelations('user', id, ['ideas', 'comments'])

    return !!deletedResources
  }
}
