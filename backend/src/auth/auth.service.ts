import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { MailService } from '@src/mail/mail.service'
import { PendingEmailChangeService } from '@src/pendingEmailChange/pendingEmailChange.service'
import { PrismaService } from '@src/prisma/prisma.service'
import { EmailAlreadyExistsException } from '@src/user/errors/emailAlreadyExists.exception'
import { User } from '@src/user/models/user.model'
import { UserService } from '@src/user/user.service'
import { RequestEmailChangeInput } from './dto/requestEmailChange.input'
import { SignInResponse } from './dto/signInResponse'
import { SignUpInput } from './dto/signUp.input'
import { CustomUnauthorizedException } from './errors/customUnauthorized.exception'
import { JwtPayload } from './types/jwt.type'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private pendingEmailChangeService: PendingEmailChangeService,
    private userService: UserService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<boolean> {
    const newUser = await this.userService.create(signUpInput)
    const emailVerificationToken = this.generateJwtToken(newUser.id, newUser.email)
    const isEmailSent = await this.mailService.sendRegistrationVerificationEmail(
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

    return {
      accessToken: this.generateJwtToken(user.id, user.email),
      user,
    }
  }

  async requestEmailChange(userId: number, requestEmailChangeInput: RequestEmailChangeInput): Promise<boolean> {
    const user = await this.userService.findById(userId)

    if (!(await this.isPasswordCorrect(requestEmailChangeInput.currentPassword, user))) {
      throw new CustomUnauthorizedException('incorrectPassword')
    }

    if (await this.userService.isEmailExists(requestEmailChangeInput.newEmail)) {
      throw new EmailAlreadyExistsException()
    }

    const emailVerificationToken = this.generateJwtToken(userId, requestEmailChangeInput.newEmail)
    const isEmailSent = await this.mailService.sendEmailChangeVerificationEmail(
      requestEmailChangeInput.newEmail,
      emailVerificationToken,
      user.username,
    )

    let isPendingEmailChangeCreated = false

    if (isEmailSent) {
      const pendingEmailChange = await this.pendingEmailChangeService.create(
        userId,
        requestEmailChangeInput.newEmail,
        emailVerificationToken,
      )
      isPendingEmailChangeCreated = !!pendingEmailChange
    }

    return isEmailSent && isPendingEmailChangeCreated
  }

  generateJwtToken(userId: number, email: string): string {
    return this.jwtService.sign({ email, sub: userId }, { expiresIn: this.configService.get('JWT_EXPIRES_IN') })
  }

  verifyJwtToken(token: string): JwtPayload {
    return this.jwtService.decode(token)
  }

  async verifyUser(userId: number): Promise<boolean> {
    return await this.userService.verify(userId)
  }

  async verifyEmailChange(userId: number, newEmail: string, pendingEmailChangeId: number): Promise<boolean> {
    await this.prismaService.runTransaction(async () => {
      await this.userService.verifyAndChangeEmail(userId, newEmail)
      await this.pendingEmailChangeService.softDelete(pendingEmailChangeId)
    })
    return true
  }

  isEmailVerified(user: User): boolean {
    return user.emailVerifiedAt !== null
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email)

    if (user && (await this.isPasswordCorrect(password, user))) {
      return user
    }

    return null
  }

  async isPasswordCorrect(password: string, user: User): Promise<boolean> {
    return await bcrypt.compare(password, user.password)
  }
}
