import { UseGuards } from '@nestjs/common'
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Request } from 'express'

import { AuthenticatedUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { OptionalJwtAuthGuard } from '@src/auth/guards/optionalJwtAuth.guard'
import { RequestedFields, RequestedFieldsMap } from '@src/common/decorators/requestedFields.decorator'
import { CustomBadRequestException } from '@src/common/errors/customBadRequest.exception'
import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { User } from '@src/user/user.model'
import { IdeaCreateInput } from './dto/ideaCreate.input'
import { IdeasGetArgs } from './dto/ideasGet.args'
import { Idea } from './idea.model'
import { IdeaService } from './idea.service'

@Resolver()
export class IdeaResolver {
  constructor(private ideaService: IdeaService) {}

  @Query(() => [Idea], { nullable: true })
  @UseGuards(OptionalJwtAuthGuard)
  async ideas(
    @RequestedFields() requestedFields: RequestedFieldsMap,
    @Args() ideasGetArgs?: IdeasGetArgs,
    @AuthenticatedUser() user?: User,
  ): Promise<Idea[]> {
    CustomBadRequestException.validateOrThrow([
      {
        condition: ideasGetArgs?.includeReportedBySelf === false && user?.id === undefined,
        message: {
          field: 'ideas.argument.includeReportedBySelf',
          error: "Authorization Bearer token is required if 'includeReportedBySelf' is set to false",
        },
      },
      {
        condition: requestedFields.isMyFavorite && user?.id === undefined,
        message: {
          field: 'ideas.field.isMyFavorite',
          error: 'Authorization Bearer token is required if ideas.isMyFavorite field is requested',
        },
      },
      {
        condition: requestedFields.comments?.isMyFavorite && user?.id === undefined,
        message: {
          field: 'ideas.field.comments.isMyFavorite',
          error: 'Authorization Bearer token is required if ideas.comments.isMyFavorite field is requested',
        },
      },
    ])

    const relations = this.ideaService.createRelations(
      Object.keys(requestedFields),
      this.ideaService.FIELD_RELATIONS,
      user?.id,
    )

    if (user) {
      return await this.ideaService.list({ ideasGetArgs, reporterId: user?.id }, relations)
    }

    return await this.ideaService.list({ ideasGetArgs }, relations)
  }

  @Query(() => Int)
  @UseGuards(OptionalJwtAuthGuard)
  async ideasCount(@Args() ideasGetArgs?: IdeasGetArgs, @AuthenticatedUser() user?: User): Promise<number> {
    CustomBadRequestException.validateOrThrow([
      {
        condition: ideasGetArgs?.includeReportedBySelf === false && user?.id === undefined,
        message: {
          field: 'ideasCount.argument.includeReportedBySelf',
          error: "Authorization Bearer token is required if 'includeReportedBySelf' is set to false",
        },
      },
    ])

    if (user) {
      return await this.ideaService.count({ ideasGetArgs, reporterId: user?.id })
    }

    return await this.ideaService.count({ ideasGetArgs })
  }

  @Query(() => Idea)
  @UseGuards(OptionalJwtAuthGuard)
  async idea(
    @RequestedFields() requestedFields: RequestedFieldsMap,
    @Args('id', { type: () => Int }) id: number,
    @AuthenticatedUser() user?: User,
  ): Promise<Idea> {
    CustomBadRequestException.validateOrThrow([
      {
        condition: requestedFields.isMyFavorite && user?.id === undefined,
        message: {
          field: 'idea.field.isMyFavorite',
          error: 'Authorization Bearer token is required if idea.isMyFavorite field is requested',
        },
      },
    ])

    const relations = this.ideaService.createRelations(
      Object.keys(requestedFields),
      this.ideaService.FIELD_RELATIONS,
      user?.id,
    )
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
}
