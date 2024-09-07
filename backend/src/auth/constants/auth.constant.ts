export const UNAUTHORIZED_ERROR = {
  userNotFound: {
    message: 'User not found.',
    code: 'USER_NOT_FOUND',
  },
  userNotVerified: {
    message: 'User not verified.',
    code: 'USER_NOT_VERIFIED',
  },
  invalidToken: {
    message: 'Invalid token.',
    code: 'INVALID_TOKEN',
  },
  incorrectPassword: {
    message: 'Incorrect password.',
    code: 'INCORRECT_PASSWORD',
  },
} as const
