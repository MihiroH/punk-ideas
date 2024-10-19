import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AuthenticatedUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { RequestedFields } from '@src/common/decorators/requestedFields.decorator'
import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { User } from '@src/user/models/user.model'
import { UserProfileUpdateInput } from './dto/userProfileUpdate.input'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async user(@RequestedFields() requestedFields: string[], @AuthenticatedUser() user: User): Promise<User> {
    const relations = this.userService.createRelations(requestedFields, this.userService.FIELD_RELATIONS, user.id)
    const resource = await this.userService.getById(user.id, relations)

    if (!resource) {
      throw new ResourceNotFoundException(`User not found with the provided id: ${user.id}`)
    }

    return resource
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUserProfile(
    @Args('userProfileUpdateInput') userProfileUpdateInput: UserProfileUpdateInput,
    @AuthenticatedUser() user: User,
  ): Promise<User> {
    return await this.userService.updateProfile(user.id, userProfileUpdateInput)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@AuthenticatedUser() user: User): Promise<boolean> {
    return await this.userService.deleteWithRelations(user.id)
  }
}
