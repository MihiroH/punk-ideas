import { UnauthorizedException } from '@nestjs/common'

import { UNAUTHORIZED_ERROR } from '../constants/auth.constant'

export class CustomUnauthorizedException extends UnauthorizedException {
  constructor(code: keyof typeof UNAUTHORIZED_ERROR, error?: Error) {
    super({
      statusCode: 401,
      message: UNAUTHORIZED_ERROR[code].message,
      error: error ?? 'Unauthorized',
      code: UNAUTHORIZED_ERROR[code].code,
    })
  }
}
