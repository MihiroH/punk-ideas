import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql'

import { AuthenticatedUser } from '@src/auth/decorators/currentUser.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwtAuth.guard'
import { User } from '@src/user/models/user.model'
import { IdeaFileService } from './ideaFile.service'
import { IdeaFile } from './models/ideaFile.model'

@Resolver()
export class IdeaFileResolver {
  constructor(private fileService: IdeaFileService) {}

  @Mutation(() => IdeaFile)
  @UseGuards(JwtAuthGuard)
  async createIdeaFile(
    @Args('ideaId', { type: () => Int }) ideaId: number,
    @AuthenticatedUser() user: User,
  ): Promise<IdeaFile> {
    return await this.fileService.create(ideaId, user.id)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteIdeaFavorite(
    @Args('ideaId', { type: () => Int }) ideaId: number,
    @AuthenticatedUser() user: User,
  ): Promise<boolean> {
    return await this.fileService.delete(ideaId, user.id)
  }
}
