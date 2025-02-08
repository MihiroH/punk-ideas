import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Request } from 'express'

import { AuthenticatedUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { User } from '@src/user/user.model'
import { Comment } from './comment.model'
import { CommentService } from './comment.service'
import { CommentCreateInput } from './dto/commentCreate.input'

@Resolver()
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Args('commentCreateInput') commentCreateInput: CommentCreateInput,
    @Context() { req }: { req: Request },
    @AuthenticatedUser() user: User,
  ): Promise<Comment> {
    return await this.commentService.create(commentCreateInput, user.id, req.ip ?? '')
  }
}
