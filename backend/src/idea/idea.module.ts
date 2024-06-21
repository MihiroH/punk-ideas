import { Module } from '@nestjs/common'

import { PrismaModule } from '@src/prisma/prisma.module'
import { IdeaResolver } from './idea.resolver'
import { IdeaService } from './idea.service'

@Module({
  imports: [PrismaModule],
  providers: [IdeaService, IdeaResolver],
})
export class IdeaModule {}
