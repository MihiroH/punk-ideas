import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { AuthenticatedUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { IdeasGetArgs } from '@src/idea/dto/ideasGet.args'
import { IdeaService } from '@src/idea/idea.service'
import { Idea } from '@src/idea/models/idea.model'
import { User } from '@src/user/models/user.model'
import { UserProfileUpdateInput } from './dto/userProfileUpdate.input'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private ideaService: IdeaService,
  ) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async user(@AuthenticatedUser() user: User): Promise<User> {
    const resource = await this.userService.getById(user.id)

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

  @ResolveField(() => [Idea])
  async ideas(@Parent() user: User, @Args() ideasGetArgs?: IdeasGetArgs): Promise<Idea[]> {
    return await this.ideaService.listByAuthorId(user.id, { ideasGetArgs })
  }
}
