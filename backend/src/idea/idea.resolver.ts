import { UseGuards } from '@nestjs/common'
import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Request } from 'express'

import { AuthenticatedUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { OptionalJwtAuthGuard } from '@src/auth/guards/optionalJwtAuth.guard'
import { CommentService } from '@src/comment/comment.service'
import { Comment } from '@src/comment/models/comment.model'
import { RequestedFields } from '@src/common/decorators/requestedFields.decorator'
import { CustomBadRequestException } from '@src/common/errors/customBadRequest.exception'
import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { User } from '@src/user/models/user.model'
import { IdeaCreateInput } from './dto/ideaCreate.input'
import { IdeasGetArgsExtended } from './dto/ideasGet.args'
import { IdeaService } from './idea.service'
import { Idea } from './models/idea.model'

@Resolver(() => Idea)
export class IdeaResolver {
  constructor(
    private ideaService: IdeaService,
    private commentService: CommentService,
  ) {}

  @Query(() => [Idea], { nullable: true })
  @UseGuards(OptionalJwtAuthGuard)
  async ideas(
    @RequestedFields() requestedFields: string[],
    @Args() ideasGetArgs?: IdeasGetArgsExtended,
    @AuthenticatedUser() user?: User,
  ): Promise<Idea[]> {
    if (ideasGetArgs?.includeReportedBySelf === false && user?.id === undefined) {
      throw new CustomBadRequestException([
        {
          field: 'includeReportedBySelf',
          error: 'Authorization Bearer token is required if includeReportedBySelf is false',
        },
      ])
    }

    const relations = this.ideaService.createRelations(requestedFields)

    if (user) {
      return await this.ideaService.list({ ideasGetArgs, reporterId: user?.id }, relations)
    }

    return await this.ideaService.list({ ideasGetArgs }, relations)
  }

  @Query(() => Int)
  @UseGuards(OptionalJwtAuthGuard)
  async ideasCount(@Args() ideasGetArgs?: IdeasGetArgsExtended, @AuthenticatedUser() user?: User): Promise<number> {
    if (ideasGetArgs?.includeReportedBySelf === false && user?.id === undefined) {
      throw new CustomBadRequestException([
        {
          field: 'includeReportedBySelf',
          error: 'Authorization Bearer token is required if includeReportedBySelf is false',
        },
      ])
    }

    if (user) {
      return await this.ideaService.count({ ideasGetArgs, reporterId: user?.id })
    }

    return await this.ideaService.count({ ideasGetArgs })
  }

  @Query(() => Idea)
  async idea(@RequestedFields() requestedFields: string[], @Args('id', { type: () => Int }) id: number): Promise<Idea> {
    const relations = this.ideaService.createRelations(requestedFields)
    const resource = await this.ideaService.getById(id, relations)

    if (!resource) {
      throw new ResourceNotFoundException(`Idea not found with the provided id: ${id}`)
    }

    return resource
  }

  @Mutation(() => Idea)
  @UseGuards(JwtAuthGuard)
  async createIdea(
    @Args('ideaCreateInput') ideaCreateInput: IdeaCreateInput,
    @Context() { req }: { req: Request },
    @AuthenticatedUser() user: User,
  ): Promise<Idea> {
    return await this.ideaService.create(ideaCreateInput, user.id, req.ip ?? '')
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteIdea(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return await this.ideaService.delete(id)
  }

  @ResolveField(() => [Comment])
  async comments(@Parent() idea: Idea): Promise<Comment[]> {
    return await this.commentService.listByIdeaId(idea.id)
  }
}
