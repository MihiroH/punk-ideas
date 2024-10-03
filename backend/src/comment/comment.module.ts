import { Module } from '@nestjs/common'

import { PrismaModule } from '@src/prisma/prisma.module'
import { CommentResolver } from './comment.resolver'
import { CommentService } from './comment.service'

@Module({
  imports: [PrismaModule],
  providers: [CommentService, CommentResolver],
  exports: [CommentService],
})
export class CommentModule {}
