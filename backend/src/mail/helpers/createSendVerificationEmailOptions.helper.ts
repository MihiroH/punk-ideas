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
}

export const createSendVerificationEmailOptions = ({
  token,
  username,
  fromAddress,
  toAddress,
  mailVerificationUrl,
  tokenExpirationTime,
}: CreateSendVerificationEmailOptionsArgs): SendEmailOptions => {
  const expirationTime = calculateExpirationTime(tokenExpirationTime)
  const formattedExpirationTime = format(expirationTime, 'yyyy/MM/dd HH:mm:ss')

  return {
    from: `"Punk Ideas" <${fromAddress}>`,
    to: toAddress,
    subject: '【Punk Ideas】仮登録完了のお知らせ',
    text: `${username ?? toAddress} 様\n\nPunk Ideas にご登録いただき、ありがとうございます。\n本メールは、ご登録いただいたメールアドレスが正しいかどうかを確認するための認証用メールです。\n\nメール認証を完了するために、下記のリンクからPunk Ideasにアクセスしてください。\n\n${mailVerificationUrl}?token=${token}\n\nこのURLの有効期限は ${formattedExpirationTime} です。\n\n\nメール認証は、上記のリンクにてアクセスするまで完了しません。\nこのメールに心当たりがない方は、お手数をおかけしますがこのメールは破棄してください。`,
    html: `<p>
             ${username ?? toAddress} 様<br /><br />
             Punk Ideas にご登録いただき、ありがとうございます。<br />
             本メールは、ご登録いただいたメールアドレスが正しいかどうかを確認するための認証用メールです。<br /><br />
             メール認証を完了するために、下記のリンクからPunk Ideasにアクセスしてください。<br /><br />
             <a href="${mailVerificationUrl}?token=${token}" target="_blank">${mailVerificationUrl}?token=${token}</a><br /><br /><br />
             このURLの有効期限は ${formattedExpirationTime} です。メール認証は、上記のリンクにてアクセスするまで完了しません。<br />
             このメールに心当たりがない方は、お手数をおかけしますがこのメールは破棄してください。
          </p>`,
  }
}
