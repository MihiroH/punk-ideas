import { join } from 'node:path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { IdeaModule } from './idea/idea.module'
import { IdeaService } from './idea/idea.service'
import { PrismaModule } from './prisma/prisma.module'
import { UserService } from './user/user.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TODO: 実装時にコメントアウトを外す
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    PrismaModule,
    IdeaModule,
  ],
  providers: [IdeaService, UserService],
})
export class AppModule {}
