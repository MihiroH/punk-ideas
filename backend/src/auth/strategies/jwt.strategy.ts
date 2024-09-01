import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@prisma/client'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserService } from '@src/user/user.service'
import { AuthService } from '../auth.service'
import { CustomUnauthorizedException } from '../errors/unauthorized.exception'
import { JwtPayload } from '../types/jwtPayload.type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOneByEmail(payload.email)

    if (!user) {
      throw new CustomUnauthorizedException('userNotFound')
    }

    if (!this.authService.isEmailVerified(user)) {
      throw new CustomUnauthorizedException('userNotVerified')
    }

    return user
  }
}
