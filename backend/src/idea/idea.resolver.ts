import { UseGuards } from '@nestjs/common'
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Request } from 'express'

import { CurrentUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { OptionalJwtAuthGuard } from '@src/auth/guards/optionalJwtAuth.guard'
import { SORT_ORDER } from '@src/common/constants/sortOrder.constant'
import { User } from '@src/user/models/user.model'
import { IdeaCreateInput } from './dto/ideaCreate.input'
import { IdeasGetArgs } from './dto/ideasGet.args'
import { IdeaService } from './idea.service'
import { Idea } from './models/idea.model'

@Resolver()
export class IdeaResolver {
  private relations = {
    author: true,
    comments: {
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: SORT_ORDER.desc,
      },
      include: {
        author: true,
      },
    },
    ideaCategories: {
      include: {
        category: true,
      },
    },
  }

  constructor(private ideaService: IdeaService) {}

  @Query(() => [Idea], { nullable: true })
  @UseGuards(OptionalJwtAuthGuard)
  async ideas(@Args() ideasGetArgs?: IdeasGetArgs, @CurrentUser() user?: User): Promise<Idea[]> {
    if (user) {
      return await this.ideaService.findMany({ ideasGetArgs, authorId: user?.id }, this.relations)
    }

    return await this.ideaService.findMany({ ideasGetArgs }, this.relations)
  }

  @Query(() => Idea, { nullable: true })
  async idea(@Args('id', { type: () => Int }) id: number): Promise<Idea> {
    return await this.ideaService.findById(id, this.relations)
  }

  @Mutation(() => Idea)
  @UseGuards(JwtAuthGuard)
  async createIdea(
    @Args('ideaCreateInput') ideaCreateInput: IdeaCreateInput,
    @Context() { req }: { req: Request },
    @CurrentUser() user: User,
  ): Promise<Idea> {
    return await this.ideaService.create(ideaCreateInput, user.id, req.ip)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteIdea(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return await this.ideaService.softDelete(id)
  }
}
