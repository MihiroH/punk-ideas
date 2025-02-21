import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { Observable } from 'rxjs'

import { COOKIE_OPTIONS } from '@src/common/config/cookie.config'
import { CustomUnauthorizedException } from '../errors/customUnauthorized.exception'

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  // @ts-ignore - AuthGuardの`canActivate` メソッドの型が `boolean | Promise<boolean> | Observable<boolean>`で不一致になるため、スルー
  async canActivate(context: ExecutionContext): Promise<boolean | Observable<boolean>> {
    try {
      return await super.canActivate(context)
    } catch (err) {
      const gqlContext = GqlExecutionContext.create(context).getContext()
      const res: Response = gqlContext.res

      if (err instanceof CustomUnauthorizedException) {
        res.clearCookie('refreshToken', COOKIE_OPTIONS)
      }

      throw err
    }
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  handleRequest<User>(error: Error, user: User | false, info: unknown) {
    // エラーがある場合はスロー
    if (error) {
      throw error
    }

    // JWTが不正な場合はエラーをスロー
    if (info instanceof JsonWebTokenError || info instanceof TokenExpiredError || info instanceof NotBeforeError) {
      throw new CustomUnauthorizedException('invalidToken', info.message)
    }

    // JWTがない場合はエラーをスロー
    if (info || !user) {
      throw new CustomUnauthorizedException('noRefreshTokenProvided')
    }

    return user
  }
}
