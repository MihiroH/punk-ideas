import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { RequestedFields } from '@src/common/decorators/requestedFields.decorator'
import { User } from '@src/user/models/user.model'
import { UserProfileUpdateInput } from './dto/userProfileUpdate.input'
import { User as UserModel } from './models/user.model'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async user(@RequestedFields() requestedFields: string[], @CurrentUser() user: User): Promise<User> {
    const relations = this.userService.createRelations(requestedFields)

    return this.userService.findById(user.id, relations)
  }

  @Mutation(() => UserModel)
  @UseGuards(JwtAuthGuard)
  async updateUserProfile(
    @Args('userProfileUpdateInput') userProfileUpdateInput: UserProfileUpdateInput,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.userService.updateProfile(user.id, userProfileUpdateInput)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@CurrentUser() user: User): Promise<boolean> {
    return await this.userService.softDeleteWithRelations(user.id)
  }
}
