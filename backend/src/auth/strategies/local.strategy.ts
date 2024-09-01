import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@prisma/client'
import { Strategy } from 'passport-local'

import { AuthService } from '../auth.service'
import { CustomUnauthorizedException } from '../errors/unauthorized.exception'

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
