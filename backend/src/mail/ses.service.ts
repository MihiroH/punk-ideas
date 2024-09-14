import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EmailSendingFailedException } from './errors/emailSendingFailed.exception'
import { IMailService } from './types/mailService.interface'
import { SendEmailOptions } from './types/sendEmailOptions.type'

@Injectable()
export class SESService implements IMailService {
  private sesClient: SESClient

  constructor(private configService: ConfigService) {
    this.sesClient = new SESClient({
      // TODO: SESClientの設定を実装する
      // region: this.configService.get('AWS_REGION'),
      // credentials: {
      //   accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      //   secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      // },
    })
  }

  async sendVerificationEmail(sendEmailOptions: SendEmailOptions): Promise<boolean> {
    const sendEmailCommand = this.createSendEmailCommand(
      sendEmailOptions.from,
      sendEmailOptions.to,
      sendEmailOptions.text,
      sendEmailOptions.html,
      sendEmailOptions.subject,
    )

    try {
      await this.sesClient.send(sendEmailCommand)
      return true
    } catch (error) {
      throw new EmailSendingFailedException(`Failed to send verification email: ${error.message}`)
    }
  }

  createSendEmailCommand(
    fromAddress: string,
    toAddresses: string | string[],
    messageText: string,
    messageHTML: string,
    subject: string,
  ) {
    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: Array.isArray(toAddresses) ? toAddresses : [toAddresses],
      },
      Message: {
        Body: {
          Text: { Charset: 'UTF-8', Data: messageText },
          Html: { Charset: 'UTF-8', Data: messageHTML },
        },
        Subject: { Charset: 'UTF-8', Data: subject },
      },
      Source: fromAddress,
    })

    return command
  }
}
