import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

import { IMailService } from './types/mailService.interface'
import { SendEmailOptions } from './types/sendEmailOptions.type'

@Injectable()
export class MailPitService implements IMailService {
  private transporter: nodemailer.Transporter

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAILPIT_SMTP_HOST'),
      port: this.configService.get('MAILPIT_SMTP_PORT'),
      secure: false, // 開発環境で動作させるためTLSを使わない
    })
  }

  async sendVerificationEmail(sendEmailOptions: SendEmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail(sendEmailOptions)
      return true
    } catch (error) {
      throw new InternalServerErrorException(`Failed to send verification email: ${error.message}`)
    }
  }
}
