import { UseGuards } from '@nestjs/common'
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Idea, User } from '@prisma/client'
import { Request } from 'express'

import { CurrentUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { OptionalJwtAuthGuard } from '@src/auth/guards/optionalJwtAuth.guard'
import { CreateIdeaInput } from './dto/createIdea.input'
import { GetIdeasArgs } from './dto/getIdeas.args'
import { IdeaService } from './idea.service'
import { Idea as IdeaModel } from './models/idea.model'

@Resolver()
export class IdeaResolver {
  constructor(private ideaService: IdeaService) {}

  @Query(() => [IdeaModel], { nullable: 'items' })
  @UseGuards(OptionalJwtAuthGuard)
  async ideas(@Args() getIdeasArgs?: GetIdeasArgs, @CurrentUser() user?: User): Promise<Idea[]> {
    if (user) {
      return await this.ideaService.findMany({ getIdeasArgs, authorId: user?.id })
    }

    return await this.ideaService.findMany({ getIdeasArgs })
  }

  @Query(() => IdeaModel, { nullable: true })
  async idea(@Args('id', { type: () => Int }) id: number): Promise<Idea> {
    return await this.ideaService.findOne(id)
  }

  @Mutation(() => IdeaModel)
  @UseGuards(JwtAuthGuard)
  async createIdea(
    @Args('createIdeaInput') createIdeaInput: CreateIdeaInput,
    @Context() { req }: { req: Request },
    @CurrentUser() user: User,
  ): Promise<Idea> {
    return await this.ideaService.create(createIdeaInput, user.id, req.ip)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteIdea(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.ideaService.softDelete(id)
    return true
  }
}
