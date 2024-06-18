// import { join } from 'node:path'
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
// import { GraphQLModule } from '@nestjs/graphql'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TODO: 実装時にコメントアウトを外す
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: true,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    // }),
    PrismaModule,
  ],
})
export class AppModule {}
