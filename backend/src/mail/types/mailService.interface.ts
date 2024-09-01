import { SendEmailOptions } from './sendEmailOptions.type'

export interface IMailService {
  sendVerificationEmail(sendEmailOptions: SendEmailOptions): Promise<boolean>
}
