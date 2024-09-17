import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Request } from 'express'

import { CurrentUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { User } from '@src/user/models/user.model'
import { CommentService } from './comment.service'
import { CommentCreateInput } from './dto/commentCreate.input'
import { Comment } from './models/comment.model'

@Resolver()
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Args('commentCreateInput') commentCreateInput: CommentCreateInput,
    @Context() { req }: { req: Request },
    @CurrentUser() user: User,
  ): Promise<Comment> {
    return await this.commentService.create(commentCreateInput, user.id, req.ip)
  }
}
