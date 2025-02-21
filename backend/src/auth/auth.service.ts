import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { CustomInternalServerErrorException } from '@src/common/errors/customInternalServerError.exception'
import { MailService } from '@src/mail/mail.service'
import { PendingEmailChangeService } from '@src/pendingEmailChange/pendingEmailChange.service'
import { PrismaService } from '@src/prisma/prisma.service'
import { EmailAlreadyExistsException } from '@src/user/errors/emailAlreadyExists.exception'
import { User } from '@src/user/user.model'
import { UserService } from '@src/user/user.service'
import { EmailChangeRequestInput } from './dto/emailChangeRequest.input'
import { SignInResponse } from './dto/signIn.response'
import { SignUpInput } from './dto/signUp.input'
import { CustomUnauthorizedException } from './errors/customUnauthorized.exception'
import { JwtPayload, JwtSignOptions } from './types/jwt.type'

@Injectable()
export class AuthService {
  private emailAccessTokenConfig: JwtSignOptions
  private accessTokenConfig: JwtSignOptions
  private refreshTokenConfig: JwtSignOptions

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private pendingEmailChangeService: PendingEmailChangeService,
    private userService: UserService,
  ) {
    this.emailAccessTokenConfig = {
      secret: this.configService.get('JWT_EMAIL_SECRET') ?? '',
      expiresIn: this.configService.get('JWT_EMAIL_EXPIRES_IN') ?? '',
    }
    this.accessTokenConfig = {
      secret: this.configService.get('JWT_SECRET') ?? '',
      expiresIn: this.configService.get('JWT_EXPIRES_IN') ?? '',
    }
    this.refreshTokenConfig = {
      secret: this.configService.get('JWT_REFRESH_SECRET') ?? '',
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') ?? '',
    }

    const undefinedEnvVars: string[] = []

    if (!this.accessTokenConfig.secret) {
      undefinedEnvVars.push('JWT_SECRET')
    }

    if (!this.accessTokenConfig.expiresIn) {
      undefinedEnvVars.push('JWT_EXPIRES_IN')
    }

    if (!this.refreshTokenConfig.secret) {
      undefinedEnvVars.push('JWT_REFRESH_SECRET')
    }

    if (!this.refreshTokenConfig.expiresIn) {
      undefinedEnvVars.push('JWT_REFRESH_EXPIRES_IN')
    }

    if (undefinedEnvVars.length > 0) {
      throw new CustomInternalServerErrorException(
        `${undefinedEnvVars.join(', ')} is not defined in the environment variables`,
      )
    }
  }

  async signUp(signUpInput: SignUpInput): Promise<boolean> {
    const newUser = await this.userService.create(signUpInput)
    const emailVerificationToken = this.generateToken('email', newUser.id, newUser.email)
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

    const accessToken = this.generateToken('access', user.id, user.email)
    const refreshToken = this.generateToken('refresh', user.id, user.email)

    await this.userService.updateRefreshToken(user.id, refreshToken)

    return {
      accessToken,
      refreshToken,
      user,
    }
  }

  async signOut(userId: number): Promise<boolean> {
    return !!(await this.userService.deleteRefreshToken(userId))
  }

  async requestEmailChange(userId: number, emailChangeRequestInput: EmailChangeRequestInput): Promise<boolean> {
    const user = await this.userService.getById(userId)

    if (!user) {
      throw new CustomUnauthorizedException('userNotFound')
    }

    if (!(await this.isPasswordCorrect(emailChangeRequestInput.currentPassword, user))) {
      throw new CustomUnauthorizedException('incorrectPassword')
    }

    if (await this.userService.isEmailExists(emailChangeRequestInput.newEmail)) {
      throw new EmailAlreadyExistsException()
    }

    const emailVerificationToken = this.generateToken('email', userId, emailChangeRequestInput.newEmail)
    const isEmailSent = await this.mailService.sendEmailChangeVerificationEmail(
      emailChangeRequestInput.newEmail,
      emailVerificationToken,
      user.username,
    )

    let isPendingEmailChangeCreated = false

    if (isEmailSent) {
      const pendingEmailChange = await this.pendingEmailChangeService.create(
        userId,
        emailChangeRequestInput.newEmail,
        emailVerificationToken,
      )
      isPendingEmailChangeCreated = !!pendingEmailChange
    }

    return isEmailSent && isPendingEmailChangeCreated
  }

  generateToken(type: 'email' | 'access' | 'refresh', userId: number, email: string): string {
    let options: JwtSignOptions

    switch (type) {
      case 'email':
        options = this.emailAccessTokenConfig
        break
      case 'access':
        options = this.accessTokenConfig
        break
      case 'refresh':
        options = this.refreshTokenConfig
    }

    return this.jwtService.sign({ email, sub: userId }, options)
  }

  async refreshTokens(user: User): Promise<SignInResponse> {
    const newAccessToken = this.generateToken('access', user.id, user.email)
    const newRefreshToken = this.generateToken('refresh', user.id, user.email)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    }
  }

  async isRefreshTokenCorrect(refreshToken: string, user: User): Promise<boolean> {
    if (!user || !user.refreshToken) {
      throw new CustomUnauthorizedException('invalidToken', 'User not found or user does not have a refresh token')
    }

    return await bcrypt.compare(refreshToken, user.refreshToken)
  }

  verifyToken(type: 'email' | 'access' | 'refresh', token: string): JwtPayload {
    let secret: JwtSignOptions['secret']

    switch (type) {
      case 'email':
        secret = this.emailAccessTokenConfig.secret
        break
      case 'access':
        secret = this.accessTokenConfig.secret
        break
      case 'refresh':
        secret = this.refreshTokenConfig.secret
    }

    return this.jwtService.verify(token, { secret })
  }

  async verifyUser(userId: number): Promise<boolean> {
    return await this.userService.verify(userId)
  }

  async verifyEmailChange(userId: number, newEmail: string, pendingEmailChangeId: number): Promise<boolean> {
    await this.prismaService.runTransaction(async () => {
      await this.userService.verifyAndChangeEmail(userId, newEmail)
      await this.pendingEmailChangeService.delete(pendingEmailChangeId)
    })
    return true
  }

  isEmailVerified(user: User): boolean {
    return user.emailVerifiedAt !== null
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.getByEmail(email)

    if (user && (await this.isPasswordCorrect(password, user))) {
      return user
    }

    return null
  }

  async isPasswordCorrect(password: string, user: User): Promise<boolean> {
    return await bcrypt.compare(password, user.password)
  }
}
