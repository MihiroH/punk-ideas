import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MailService } from './mail.service'
import { MailPitService } from './mailpit.service'
import { SESService } from './ses.service'

@Module({
  imports: [ConfigModule],
  providers: [MailService, MailPitService, SESService],
  exports: [MailService],
})
export class MailModule {}
