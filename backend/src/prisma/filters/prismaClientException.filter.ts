import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { GqlArgumentsHost } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'

import { PRISMA_CLIENT_ERROR_CODE } from '../constants/prisma.constant'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly ERROR_CODES_STATUS_MAP = {
    [PRISMA_CLIENT_ERROR_CODE.valueTooLong]: HttpStatus.BAD_REQUEST,
    [PRISMA_CLIENT_ERROR_CODE.uniqueConstraintFailed]: HttpStatus.CONFLICT,
    [PRISMA_CLIENT_ERROR_CODE.recordsNotFound]: HttpStatus.NOT_FOUND,
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handleException(exception, host)
    }
  }

  private handleException(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host)
    const isGqlRequest = gqlHost.getContext().req

    const status =
      exception.code in this.ERROR_CODES_STATUS_MAP
        ? this.ERROR_CODES_STATUS_MAP[exception.code]
        : HttpStatus.INTERNAL_SERVER_ERROR
    const message = `[${exception.code}]: ${this.exceptionShortMessage(exception.message)}`
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

    return shortMessage.substring(shortMessage.indexOf('\n')).replace(/\n/g, '').trim()
  }
}
