import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/client'

import { CurrentUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { User as UserModel } from './models/user.model'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async user(@CurrentUser() user: User): Promise<User> {
    return user
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.userService.softDelete(id)
    return true
  }
}
