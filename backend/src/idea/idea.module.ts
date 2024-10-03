import { Module } from '@nestjs/common'

import { CommentModule } from '@src/comment/comment.module'
import { PrismaModule } from '@src/prisma/prisma.module'
import { IdeaResolver } from './idea.resolver'
import { IdeaService } from './idea.service'

@Module({
  imports: [PrismaModule, CommentModule],
  providers: [IdeaService, IdeaResolver],
  exports: [IdeaService],
})
export class IdeaModule {}
