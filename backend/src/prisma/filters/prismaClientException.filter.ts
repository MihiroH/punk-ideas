import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { GqlArgumentsHost } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'

import { customHasOwnProperty } from '@src/common/helpers/customHasOwnProperty.helper'
import { PRISMA_CLIENT_ERROR_CODE, PRISMA_CLIENT_ERROR_NAME } from '../constants/prisma.constant'
import { PrismaClientError } from '../types/prisma.type'

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientValidationError,
)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly ERROR_NAMES_STATUS_MAP = {
    [PRISMA_CLIENT_ERROR_NAME.knownRequestError]: HttpStatus.INTERNAL_SERVER_ERROR,
    [PRISMA_CLIENT_ERROR_NAME.unknownRequestError]: HttpStatus.INTERNAL_SERVER_ERROR,
    [PRISMA_CLIENT_ERROR_NAME.rustPanicError]: HttpStatus.INTERNAL_SERVER_ERROR,
    [PRISMA_CLIENT_ERROR_NAME.initializationError]: HttpStatus.INTERNAL_SERVER_ERROR,
    [PRISMA_CLIENT_ERROR_NAME.validationError]: HttpStatus.BAD_REQUEST,
  } as const

  private readonly ERROR_CODES_STATUS_MAP = {
    [PRISMA_CLIENT_ERROR_CODE.valueTooLong]: HttpStatus.BAD_REQUEST,
    [PRISMA_CLIENT_ERROR_CODE.uniqueConstraintFailed]: HttpStatus.CONFLICT,
    [PRISMA_CLIENT_ERROR_CODE.recordsNotFound]: HttpStatus.NOT_FOUND,
  } as const

  catch(exception: PrismaClientError, host: ArgumentsHost) {
    return this.handleException(exception, host)
  }

  private handleException(exception: PrismaClientError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host)
    const isGqlRequest = gqlHost.getContext().req

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR

    if ('code' in exception && customHasOwnProperty(this.ERROR_CODES_STATUS_MAP, exception.code)) {
      status = this.ERROR_CODES_STATUS_MAP[exception.code]
    } else if (customHasOwnProperty(this.ERROR_NAMES_STATUS_MAP, exception.name)) {
      status = this.ERROR_NAMES_STATUS_MAP[exception.name]
    }

    const prefix = 'code' in exception && exception.code ? `[${exception.code}]: ` : ''
    const message = `${prefix}${this.exceptionShortMessage(exception.message)}`
    const responseBody = HttpException.createBody(message, exception.name, status)

    // GraphQLのリクエストの場合はHttpExceptionをthrowする
    // そうすると良い感じにGraphQL用のエラーレスポンスが返される
    if (isGqlRequest) {
      // NOTE: 本番環境(process.env.NODE_ENV === 'production')ではstacktraceは出力されないようになっている
      throw new HttpException(responseBody, status)
    }

    // RESTのリクエストの場合はJSONレスポンスを返す
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    response.status(status).json(responseBody)
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'))

    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n|\s\s/g, '')
      .trim()
  }
}
