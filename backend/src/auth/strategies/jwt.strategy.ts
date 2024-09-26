import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { User } from '@src/user/models/user.model'
import { UserService } from '@src/user/user.service'
import { AuthService } from '../auth.service'
import { CustomUnauthorizedException } from '../errors/customUnauthorized.exception'
import { JwtPayload } from '../types/jwt.type'

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
    const user = await this.userService.getByEmail(payload.email)

    if (!user) {
      throw new CustomUnauthorizedException('userNotFound')
    }

    if (!this.authService.isEmailVerified(user)) {
      throw new CustomUnauthorizedException('userNotVerified')
    }

    return user
  }
}
