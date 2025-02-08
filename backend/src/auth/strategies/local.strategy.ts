import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { User } from '@src/user/user.model'
import { AuthService } from '../auth.service'
import { CustomUnauthorizedException } from '../errors/customUnauthorized.exception'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password)

    if (!user) {
      throw new CustomUnauthorizedException('userNotFound')
    }

    return user
  }
}
