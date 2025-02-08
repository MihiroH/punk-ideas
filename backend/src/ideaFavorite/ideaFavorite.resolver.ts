import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql'

import { AuthenticatedUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { User } from '@src/user/user.model'
import { IdeaFavorite } from './ideaFavorite.model'
import { IdeaFavoriteService } from './ideaFavorite.service'

@Resolver()
export class IdeaFavoriteResolver {
  constructor(private favoriteService: IdeaFavoriteService) {}

  @Mutation(() => IdeaFavorite)
  @UseGuards(JwtAuthGuard)
  async createIdeaFavorite(
    @Args('ideaId', { type: () => Int }) ideaId: number,
    @AuthenticatedUser() user: User,
  ): Promise<IdeaFavorite> {
    return await this.favoriteService.create(ideaId, user.id)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteIdeaFavorite(
    @Args('ideaId', { type: () => Int }) ideaId: number,
    @AuthenticatedUser() user: User,
  ): Promise<boolean> {
    return await this.favoriteService.delete(ideaId, user.id)
  }
}
