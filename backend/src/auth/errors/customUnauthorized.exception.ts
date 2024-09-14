import { UNAUTHORIZED_ERROR_MESSAGE } from '../constants/auth.constant'

export class CustomUnauthorizedException extends Error {
  public code: keyof typeof UNAUTHORIZED_ERROR_MESSAGE

  constructor(
    code: keyof typeof UNAUTHORIZED_ERROR_MESSAGE,
    message = UNAUTHORIZED_ERROR_MESSAGE[code] ?? 'Unauthorized',
  ) {
    super(message)
    this.name = 'CustomUnauthorizedException'
    this.code = code
  }
}
