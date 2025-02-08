import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { CustomInternalServerErrorException } from '@src/common/errors/customInternalServerError.exception'
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
    const mailFromAddress: string | undefined = this.configService.get('MAIL_FROM_ADDRESS')
    const tokenExpirationTime: string | undefined = this.configService.get('JWT_EXPIRES_IN')

    const undefinedEnvVars: string[] = []

    if (!mailFromAddress) {
      undefinedEnvVars.push('MAIL_FROM_ADDRESS')
    }

    if (!tokenExpirationTime) {
      undefinedEnvVars.push('JWT_EXPIRES_IN')
    }

    // !mailFromAddress || !tokenExpirationTimeのチェックは本来不要だが、後の行でtsエラーになってしまうため追加
    if (undefinedEnvVars.length > 0 || !mailFromAddress || !tokenExpirationTime) {
      throw new CustomInternalServerErrorException(
        `${undefinedEnvVars.join(', ')} is not defined in the environment variables`,
      )
    }

    this.fromAddress = mailFromAddress
    this.tokenExpirationTime = tokenExpirationTime

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
