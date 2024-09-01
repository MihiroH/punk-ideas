import { UnauthorizedException } from '@nestjs/common'

import { UNAUTHORIZED_ERROR_CODE, UNAUTHORIZED_ERROR_MESSAGE } from '../constants/auth.constant'

export class CustomUnauthorizedException extends UnauthorizedException {
  constructor(code: keyof typeof UNAUTHORIZED_ERROR_CODE, error?: Error) {
    super({
      statusCode: 401,
      message: UNAUTHORIZED_ERROR_MESSAGE[code],
      error: error ?? 'Unauthorized',
      code: UNAUTHORIZED_ERROR_CODE[code],
    })
  }
}
