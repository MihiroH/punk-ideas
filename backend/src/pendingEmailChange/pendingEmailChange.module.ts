import { Module } from '@nestjs/common'

import { PrismaModule } from '@src/prisma/prisma.module'
import { PendingEmailChangeService } from './pendingEmailChange.service'

@Module({
  imports: [PrismaModule],
  providers: [PendingEmailChangeService],
  exports: [PendingEmailChangeService],
})
export class PendingEmailChangeModule {}
