import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { MailModule } from '@src/mail/mail.module'
import { PendingEmailChangeModule } from '@src/pendingEmailChange/pendingEmailChange.module'
import { PrismaModule } from '@src/prisma/prisma.module'
import { UserModule } from '@src/user/user.module'
import { AuthController } from './auth.controller'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: process.env.JWT_EXPIRES_IN } }),
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PendingEmailChangeModule,
    PrismaModule,
    UserModule,
  ],
  providers: [AuthResolver, AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
