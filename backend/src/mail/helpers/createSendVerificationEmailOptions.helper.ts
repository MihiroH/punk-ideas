import { format } from 'date-fns'

import { SendEmailOptions } from '../types/sendEmailOptions.type'
import { calculateExpirationTime } from './calculateExpirationTime.helper'

interface CreateSendVerificationEmailOptionsArgs {
  username?: string
  fromAddress: string
  toAddress: string
  mailVerificationUrl: string
  token: string
  tokenExpirationTime: string
  subject: string
  bodyTemplate: string
}

export const createSendVerificationEmailOptions = ({
  token,
  username,
  fromAddress,
  toAddress,
  mailVerificationUrl,
  tokenExpirationTime,
  subject,
  bodyTemplate,
}: CreateSendVerificationEmailOptionsArgs): SendEmailOptions => {
  const expirationTime = calculateExpirationTime(tokenExpirationTime)
  const formattedExpirationTime = format(expirationTime, 'yyyy/MM/dd HH:mm:ss')
  const verificationUrlObj = new URL(mailVerificationUrl)
  verificationUrlObj.searchParams.append('token', token)
  const verificationUrl = verificationUrlObj.toString()

  const body = bodyTemplate
    .replace('{username}', username ?? toAddress)
    .replace('{mailVerificationUrl}', verificationUrl)
    .replace('{formattedExpirationTime}', formattedExpirationTime)

  return {
    from: `"Punk Ideas" <${fromAddress}>`,
    to: toAddress,
    subject,
    text: body,
    html: `<p>${body.replace(/\n/g, '<br />').replace(verificationUrl, `<a href="${verificationUrlObj}" target="_blank">${verificationUrlObj}</a>`)}</p>`,
  }
}
