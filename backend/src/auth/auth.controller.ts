import { Controller, Get, Query } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { PendingEmailChangeService } from '@src/pendingEmailChange/pendingEmailChange.service'
import { AuthService } from './auth.service'
import { CustomUnauthorizedException } from './errors/customUnauthorized.exception'
import { JwtPayload } from './types/jwt.type'

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private pendingEmailChangeService: PendingEmailChangeService,
    private jwtService: JwtService,
  ) {}

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    let decoded: JwtPayload = undefined

    try {
      decoded = this.authService.verifyJwtToken(token)
    } catch (error) {
      throw new CustomUnauthorizedException('invalidToken', error.message)
    }

    await this.authService.verifyUser(decoded.sub)

    return { message: 'Email verified successfully.' }
  }

  @Get('verify-email-change')
  async verifyEmailChange(@Query('token') token: string) {
    let decoded: JwtPayload = undefined

    try {
      decoded = this.authService.verifyJwtToken(token)
    } catch (error) {
      throw new CustomUnauthorizedException('invalidToken', error)
    }

    const pendingEmailChange = await this.pendingEmailChangeService.findByUserIdAndToken(decoded.sub, token)

    if (!pendingEmailChange || pendingEmailChange.email !== decoded.email) {
      throw new CustomUnauthorizedException('invalidToken')
    }

    await this.authService.verifyEmailChange(decoded.sub, decoded.email, pendingEmailChange.id)

    return { message: 'Email verified and changed successfully.' }
  }
}
