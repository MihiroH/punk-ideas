import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<User>(error: Error | null, user: User | null, info: unknown) {
    // エラーがある場合はスロー
    if (error) {
      throw error
    }

    // JWTトークンが不正な場合はエラーをスロー
    if (info instanceof JsonWebTokenError || info instanceof TokenExpiredError || info instanceof NotBeforeError) {
      throw new UnauthorizedException()
    }

    // JWTトークンがない場合はリクエストを続行
    if (info || !user) {
      return null
    }

    return user
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
