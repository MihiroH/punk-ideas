// @see: https://www.prisma.io/docs/orm/reference/error-reference#prisma-client-query-engine
export const PRISMA_CLIENT_ERROR_CODE = {
  valueTooLong: 'P2000',
  uniqueConstraintFailed: 'P2002',
  recordsNotFound: 'P2025',
} as const
