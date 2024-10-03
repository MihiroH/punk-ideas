import { Module } from '@nestjs/common'

import { IdeaModule } from '@src/idea/idea.module'
import { PrismaModule } from '@src/prisma/prisma.module'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  imports: [PrismaModule, IdeaModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
