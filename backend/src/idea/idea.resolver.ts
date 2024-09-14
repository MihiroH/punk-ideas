import { UseGuards } from '@nestjs/common'
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Request } from 'express'

import { CurrentUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { OptionalJwtAuthGuard } from '@src/auth/guards/optionalJwtAuth.guard'
import { User } from '@src/user/models/user.model'
import { CreateIdeaInput } from './dto/createIdea.input'
import { GetIdeasArgs } from './dto/getIdeas.args'
import { IdeaService } from './idea.service'
import { Idea } from './models/idea.model'

@Resolver()
export class IdeaResolver {
  constructor(private ideaService: IdeaService) {}

  @Query(() => [Idea], { nullable: true })
  @UseGuards(OptionalJwtAuthGuard)
  async ideas(@Args() getIdeasArgs?: GetIdeasArgs, @CurrentUser() user?: User): Promise<Idea[]> {
    if (user) {
      return await this.ideaService.findMany({ getIdeasArgs, authorId: user?.id })
    }

    return await this.ideaService.findMany({ getIdeasArgs })
  }

  @Query(() => Idea, { nullable: true })
  async idea(@Args('id', { type: () => Int }) id: number): Promise<Idea> {
    return await this.ideaService.findById(id)
  }

  @Mutation(() => Idea)
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
    return await this.ideaService.softDelete(id)
  }
}
