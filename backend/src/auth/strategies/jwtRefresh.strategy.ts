import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { User } from '@src/user/user.model'
import { UserService } from '@src/user/user.service'
import { AuthService } from '../auth.service'
import { CustomUnauthorizedException } from '../errors/customUnauthorized.exception'
import { JwtPayload } from '../types/jwt.type'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req?.cookies?.refreshToken]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      throw new CustomUnauthorizedException('noRefreshTokenProvided')
    }

    const user = await this.userService.getById(payload.sub)
    if (!user || !user.refreshToken) {
      throw new CustomUnauthorizedException('invalidToken', 'User not found or user does not have a refresh token')
    }

    const isMatch = await this.authService.isRefreshTokenCorrect(refreshToken, user)
    if (!isMatch) {
      throw new CustomUnauthorizedException('invalidToken', 'Refresh token does not match')
    }

    return user
  }
}
