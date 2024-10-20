import { Module } from '@nestjs/common'

import { PrismaModule } from '@src/prisma/prisma.module'
import { CommentFavoriteResolver } from './commentFavorite.resolver'
import { CommentFavoriteService } from './commentFavorite.service'

@Module({
  imports: [PrismaModule],
  providers: [CommentFavoriteService, CommentFavoriteResolver],
})
export class CommentFavoriteModule {}
