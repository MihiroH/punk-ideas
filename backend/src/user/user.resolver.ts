import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { User } from '@src/user/models/user.model'
import { UpdateUserProfileInput } from './dto/updateUser.input'
import { User as UserModel } from './models/user.model'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async user(@CurrentUser() user: User): Promise<User> {
    return this.userService.findById(user.id)
  }

  @Mutation(() => UserModel)
  @UseGuards(JwtAuthGuard)
  async updateUserProfile(
    @Args('updateUserProfileInput') updateUserProfileInput: UpdateUserProfileInput,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.userService.updateProfile(user.id, updateUserProfileInput)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@CurrentUser() user: User): Promise<boolean> {
    return await this.userService.softDeleteWithRelations(user.id)
  }
}
