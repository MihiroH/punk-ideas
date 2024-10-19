import { join } from 'node:path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { CommentModule } from './comment/comment.module'
import { IdeaModule } from './idea/idea.module'
import { IdeaFavoriteModule } from './ideaFavorite/ideaFavorite.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    AuthModule,
    CategoryModule,
    CommentModule,
    IdeaFavoriteModule,
    IdeaModule,
    UserModule,
  ],
})
export class AppModule {}
