import { Module } from '@nestjs/common'

import { PrismaModule } from '@src/prisma/prisma.module'
import { IdeaFavoriteResolver } from './ideaFavorite.resolver'
import { IdeaFavoriteService } from './ideaFavorite.service'

@Module({
  imports: [PrismaModule],
  providers: [IdeaFavoriteService, IdeaFavoriteResolver],
})
export class IdeaFavoriteModule {}
