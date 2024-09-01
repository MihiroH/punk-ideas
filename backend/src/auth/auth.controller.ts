import { Controller, Get, Query } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { AuthService } from './auth.service'
import { CustomUnauthorizedException } from './errors/unauthorized.exception'

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    let decoded: { userId: number; iat: number; exp: number } = undefined

    try {
      decoded = this.jwtService.verify(token, { secret: this.configService.get('JWT_SECRET') })
    } catch (error) {
      throw new CustomUnauthorizedException('invalidToken', error)
    }

    const isVerified = await this.authService.verifyUser(decoded.userId)

    if (!isVerified) {
      throw new CustomUnauthorizedException('emailVerificationFailed')
    }

    return { message: 'Email verified successfully.' }
  }
}
