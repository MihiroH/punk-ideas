import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { GqlArgumentsHost } from '@nestjs/graphql'
import { customHasOwnProperty } from '../helpers/customHasOwnProperty.helper'

@Catch(Error)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly ERROR_NAME_STATUS_MAP = {
    CustomBadRequestException: HttpStatus.BAD_REQUEST,
    CustomInternalServerErrorException: HttpStatus.INTERNAL_SERVER_ERROR,
    CustomUnauthorizedException: HttpStatus.UNAUTHORIZED,
    EmailAlreadyExistsException: HttpStatus.CONFLICT,
    EmailSendingFailedException: HttpStatus.INTERNAL_SERVER_ERROR,
    ResourceNotFoundException: HttpStatus.NOT_FOUND,
    UnauthorizedException: HttpStatus.UNAUTHORIZED,
  } as const

  catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof Error) {
      return this.handleException(exception, host)
    }
  }

  private handleException(exception: Error, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host)
    const isGqlRequest = gqlHost.getContext().req

    const status = customHasOwnProperty(this.ERROR_NAME_STATUS_MAP, exception.name)
      ? this.ERROR_NAME_STATUS_MAP[exception.name]
      : HttpStatus.INTERNAL_SERVER_ERROR

    // 例えばCustomBadRequestExceptionは複数のエラーメッセージを含む可能性があるためmessagesプロパティを用意している
    const message =
      'messages' in exception && Array.isArray(exception.messages)
        ? exception.messages
        : `[${exception.name}]: ${this.exceptionShortMessage(exception.message)}`

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
