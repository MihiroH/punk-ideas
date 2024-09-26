import { SORT_ORDER } from '@src/common/constants/sortOrder.constant'

export const PRISMA_CLIENT_ERROR_NAME = {
  knownRequestError: 'PrismaClientKnownRequestError',
  unknownRequestError: 'PrismaClientUnknownRequestError',
  rustPanicError: 'PrismaClientRustPanicError',
  initializationError: 'PrismaClientInitializationError',
  validationError: 'PrismaClientValidationError',
}

// @see: https://www.prisma.io/docs/orm/reference/error-reference#prisma-client-query-engine
export const PRISMA_CLIENT_ERROR_CODE = {
  valueTooLong: 'P2000',
  uniqueConstraintFailed: 'P2002',
  recordsNotFound: 'P2025',
} as const

export const DEFAULT_ORDER_BY = [{ field: 'createdAt', order: SORT_ORDER.desc }]
