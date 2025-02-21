import { CookieOptions } from 'express'

// TODO: production環境ではどうするか要検討
// TODO: ConfigModule.forRootのloadで整理した方がいいかも
//       @see: https://docs.nestjs.com/techniques/configuration#custom-configuration-files
export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
}
