import { join } from 'node:path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AuthModule } from './auth/auth.module'
import { IdeaModule } from './idea/idea.module'
import { IdeaService } from './idea/idea.service'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { UserResolver } from './user/user.resolver'
import { UserService } from './user/user.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    PrismaModule,
    IdeaModule,
    UserModule,
    AuthModule,
  ],
  providers: [IdeaService, UserService, UserResolver],
})
export class AppModule {}
