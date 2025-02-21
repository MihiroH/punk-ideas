import { UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { COOKIE_OPTIONS } from '@src/common/config/cookie.config'
import { CustomInternalServerErrorException } from '@src/common/errors/customInternalServerError.exception'
import { parseDuration } from '@src/common/helpers/parseDuration'
import { User } from '@src/user/user.model'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { AuthenticatedUser } from './decorators/currentUser.decorator'
import { EmailChangeRequestInput } from './dto/emailChangeRequest.input'
import { SignInInput } from './dto/signIn.input'
import { SignInResponse } from './dto/signIn.response'
import { SignUpInput } from './dto/signUp.input'
import { GqlAuthGuard } from './guards/gqlAuth.guard'
import { JwtAuthGuard } from './guards/jwtAuth.guard'
import { JwtRefreshAuthGuard } from './guards/jwtRefreshAuth.guard'

@Resolver()
export class AuthResolver {
  private cookieOptions = COOKIE_OPTIONS

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const refreshTokenExpiresIn: string | undefined = this.configService.get('JWT_REFRESH_EXPIRES_IN')
    const undefinedEnvVars: string[] = []

    // TODO: ConfigModule.forRootのvalidationSchemaでチェックする方が良さそう
    //       @see: https://docs.nestjs.com/techniques/configuration#schema-validation
    if (!refreshTokenExpiresIn) {
      undefinedEnvVars.push('JWT_REFRESH_EXPIRES_IN')
    }

    // undefinedEnvVars.length > 0 以外のチェックは本来不要だが、後の行でtsエラーになってしまうため追加
    if (undefinedEnvVars.length > 0 || !refreshTokenExpiresIn) {
      throw new CustomInternalServerErrorException(
        `${undefinedEnvVars.join(', ')} is not defined in the environment variables`,
      )
    }

    this.cookieOptions.maxAge = parseDuration(refreshTokenExpiresIn)
  }

  // TODO: signUp時はパスワードを受け取らず、メールアドレス認証の後で行うようにする
  //       https://chatgpt.com/share/589e5200-2d38-4cc0-ac5f-da9ed1e518ab
  @Mutation(() => Boolean)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<boolean> {
    return await this.authService.signUp(signUpInput)
  }

  @Mutation(() => SignInResponse)
  @UseGuards(GqlAuthGuard)
  async signIn(
    @Args('signInInput') _signInInput: SignInInput,
    @Context() { user, res }: { user: User; res: Response },
  ): Promise<SignInResponse> {
    const result = await this.authService.signIn(user)
    res.cookie('refreshToken', result.refreshToken, this.cookieOptions)

    return result
  }

  @Mutation(() => SignInResponse)
  @UseGuards(JwtRefreshAuthGuard)
  async refreshAccessToken(
    @Context() { res, req }: { res: Response; req: Request & { user: User } },
  ): Promise<SignInResponse> {
    const result = await this.authService.refreshTokens(req.user)
    res.cookie('refreshToken', result.refreshToken, this.cookieOptions)

    return result
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async signOut(@AuthenticatedUser() user: User, @Context() { res }: { res: Response }): Promise<boolean> {
    const isSignedOut = await this.authService.signOut(user.id)
    res.clearCookie('refreshToken', this.cookieOptions)

    return isSignedOut
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async requestEmailChange(
    @Args('emailChangeRequestInput') emailChangeRequestInput: EmailChangeRequestInput,
    @AuthenticatedUser() user: User,
  ): Promise<boolean> {
    return this.authService.requestEmailChange(user.id, emailChangeRequestInput)
  }
}
