import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql'

import { AuthenticatedUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { User } from '@src/user/user.model'
import { CommentFavorite } from './commentFavorite.model'
import { CommentFavoriteService } from './commentFavorite.service'

@Resolver()
export class CommentFavoriteResolver {
  constructor(private favoriteService: CommentFavoriteService) {}

  @Mutation(() => CommentFavorite)
  @UseGuards(JwtAuthGuard)
  async createCommentFavorite(
    @Args('commentId', { type: () => Int }) commentId: number,
    @AuthenticatedUser() user: User,
  ): Promise<CommentFavorite> {
    return await this.favoriteService.create(commentId, user.id)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteCommentFavorite(
    @Args('commentId', { type: () => Int }) commentId: number,
    @AuthenticatedUser() user: User,
  ): Promise<boolean> {
    return await this.favoriteService.delete(commentId, user.id)
  }
}
