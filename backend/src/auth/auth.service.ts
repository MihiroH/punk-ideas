import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'

import { MailService } from '@src/mail/mail.service'
import { UserService } from '@src/user/user.service'
import { SignInResponse } from './dto/signInResponse'
import { SignUpInput } from './dto/signUp.input'
import { CustomUnauthorizedException } from './errors/unauthorized.exception'
import { JwtPayload } from './types/jwtPayload.type'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<boolean> {
    const newUser = await this.userService.create(signUpInput)

    const emailVerificationToken = this.jwtService.sign({ userId: newUser.id }, { expiresIn: '1h' })
    const isEmailSent = await this.mailService.sendVerificationEmail(
      newUser.email,
      emailVerificationToken,
      newUser.username,
    )

    return !!newUser && isEmailSent
  }

  async signIn(user: User): Promise<SignInResponse> {
    if (!this.isEmailVerified(user)) {
      throw new CustomUnauthorizedException('userNotVerified')
    }

    const payload: JwtPayload = { email: user.email, sub: user.id }

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    }
  }

  async verifyUser(userId: number) {
    return await this.userService.verify(userId)
  }

  isEmailVerified(user: User) {
    return user.emailVerifiedAt !== null
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email)

    if (user && (await bcrypt.compare(password, user.password))) {
      return user
    }

    return null
  }
}
