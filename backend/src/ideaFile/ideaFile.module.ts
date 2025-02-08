import { Module } from '@nestjs/common'

import { PrismaModule } from '@src/prisma/prisma.module'
import { IdeaFileResolver } from './ideaFile.resolver'
import { IdeaFileService } from './ideaFile.service'

@Module({
  imports: [PrismaModule],
  providers: [IdeaFileService, IdeaFileResolver],
})
export class IdeaFavoriteModule {}
