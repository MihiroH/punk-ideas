import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Idea } from '@prisma/client'
import { Request } from 'express'

import { CreateIdeaInput } from './dto/createIdea.input'
import { IdeaService } from './idea.service'
import { Idea as IdeaModel } from './models/idea.model'

@Resolver()
export class IdeaResolver {
  constructor(private ideaService: IdeaService) {}

  @Query(() => [IdeaModel], { nullable: 'items' })
  async ideas(): Promise<Idea[]> {
    return await this.ideaService.getIdeas()
  }

  @Query(() => IdeaModel, { nullable: true })
  async idea(@Args('id', { type: () => Int }) id: number): Promise<Idea> {
    return await this.ideaService.getIdea(id)
  }

  @Mutation(() => IdeaModel)
  async createIdea(
    @Args('createIdeaInput') createIdeaInput: CreateIdeaInput,
    @Context() { req }: { req: Request },
  ): Promise<Idea> {
    return await this.ideaService.createIdea(createIdeaInput, req.ip)
  }

  @Mutation(() => Boolean)
  async deleteIdea(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.ideaService.deleteIdea(id)
    return true
  }
}
