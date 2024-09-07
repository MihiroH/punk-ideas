import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { createSendVerificationEmailOptions } from './helpers/createSendVerificationEmailOptions.helper'
import { MailPitService } from './mailpit.service'
import { SESService } from './ses.service'
import * as emailChangeVerificationTemplate from './templates/emailChangeVerification.template'
import * as registrationVerificationTemplate from './templates/registrationVerification.template'
import { IMailService } from './types/mailService.interface'

@Injectable()
export class MailService {
  private mailService: IMailService
  private fromAddress: string
  private tokenExpirationTime: string

  constructor(
    private configService: ConfigService,
    private SESService: SESService,
    private mailPitService: MailPitService,
  ) {
    this.fromAddress = this.configService.get('MAIL_FROM_ADDRESS')
    this.tokenExpirationTime = this.configService.get('JWT_EXPIRES_IN')

    switch (this.configService.get('NODE_ENV')) {
      case 'production':
      case 'staging':
        this.mailService = this.SESService
        break
      default:
        this.mailService = this.mailPitService
    }
  }

  sendRegistrationVerificationEmail(email: string, token: string, username?: string): Promise<boolean> {
    const mailVerificationUrl = this.configService.get('MAIL_REGISTRATION_VERIFICATION_URL')
    const sendEmailOptions = createSendVerificationEmailOptions({
      username,
      fromAddress: this.fromAddress,
      toAddress: email,
      mailVerificationUrl,
      token,
      tokenExpirationTime: this.tokenExpirationTime,
      subject: registrationVerificationTemplate.subject,
      bodyTemplate: registrationVerificationTemplate.body,
    })

    return this.mailService.sendVerificationEmail(sendEmailOptions)
  }

  sendEmailChangeVerificationEmail(email: string, token: string, username?: string): Promise<boolean> {
    const mailVerificationUrl = this.configService.get('MAIL_CHANGE_EMAIL_VERIFICATION_URL')
    const sendEmailOptions = createSendVerificationEmailOptions({
      username,
      fromAddress: this.fromAddress,
      toAddress: email,
      mailVerificationUrl,
      token,
      tokenExpirationTime: this.tokenExpirationTime,
      subject: emailChangeVerificationTemplate.subject,
      bodyTemplate: emailChangeVerificationTemplate.body,
    })

    return this.mailService.sendVerificationEmail(sendEmailOptions)
  }
}
