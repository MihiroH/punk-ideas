import { UseGuards } from '@nestjs/common'
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Request } from 'express'

import { CurrentUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { OptionalJwtAuthGuard } from '@src/auth/guards/optionalJwtAuth.guard'
import { RequestedFields } from '@src/common/decorators/requestedFields.decorator'
import { CustomBadRequestException } from '@src/common/errors/customBadRequest.exception'
import { ResourceNotFoundException } from '@src/common/errors/resourceNotFound.exception'
import { User } from '@src/user/models/user.model'
import { IdeaCreateInput } from './dto/ideaCreate.input'
import { IdeasGetArgs } from './dto/ideasGet.args'
import { IdeaService } from './idea.service'
import { Idea } from './models/idea.model'

@Resolver()
export class IdeaResolver {
  constructor(private ideaService: IdeaService) {}

  @Query(() => [Idea], { nullable: true })
  @UseGuards(OptionalJwtAuthGuard)
  async ideas(
    @RequestedFields() requestedFields: string[],
    @Args() ideasGetArgs?: IdeasGetArgs,
    @CurrentUser() user?: User,
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
      return await this.ideaService.findMany({ ideasGetArgs, userId: user?.id }, relations)
    }

    return await this.ideaService.findMany({ ideasGetArgs }, relations)
  }

  @Query(() => Int)
  @UseGuards(OptionalJwtAuthGuard)
  async ideasCount(@Args() ideasGetArgs?: IdeasGetArgs, @CurrentUser() user?: User): Promise<number> {
    if (ideasGetArgs?.includeReportedBySelf === false && user?.id === undefined) {
      throw new CustomBadRequestException([
        {
          field: 'includeReportedBySelf',
          error: 'Authorization Bearer token is required if includeReportedBySelf is false',
        },
      ])
    }

    if (user) {
      return await this.ideaService.count({ ideasGetArgs, userId: user?.id })
    }

    return await this.ideaService.count({ ideasGetArgs })
  }

  @Query(() => Idea)
  async idea(@RequestedFields() requestedFields: string[], @Args('id', { type: () => Int }) id: number): Promise<Idea> {
    const relations = this.ideaService.createRelations(requestedFields)
    const resource = await this.ideaService.findById(id, relations)

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
    @CurrentUser() user: User,
  ): Promise<Idea> {
    return await this.ideaService.create(ideaCreateInput, user.id, req.ip ?? '')
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteIdea(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return await this.ideaService.softDelete(id)
  }
}
