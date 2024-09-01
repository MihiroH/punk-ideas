export const UNAUTHORIZED_ERROR_MESSAGE = {
  userNotFound: 'User not found.',
  userNotVerified: 'User not verified.',
  invalidToken: 'Invalid token.',
  emailVerificationFailed: 'Email verification failed.',
} as const

export const UNAUTHORIZED_ERROR_CODE = {
  userNotFound: 'USER_NOT_FOUND',
  userNotVerified: 'USER_NOT_VERIFIED',
  invalidToken: 'INVALID_TOKEN',
  emailVerificationFailed: 'EMAIL_VERIFICATION_FAILED',
} as const
