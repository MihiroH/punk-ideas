import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'

import { CustomUnauthorizedException } from '../errors/customUnauthorized.exception'

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  handleRequest<User>(error: Error | null, user: User | false, info: unknown) {
    // エラーがある場合はスロー
    if (error) {
      throw error
    }

    // JWTが不正な場合はエラーをスロー
    if (info instanceof JsonWebTokenError || info instanceof TokenExpiredError || info instanceof NotBeforeError) {
      throw new CustomUnauthorizedException('invalidToken', info.message)
    }

    // JWTがない場合はリクエストを続行
    if (info || !user) {
      return null
    }

    return user
  }
}
