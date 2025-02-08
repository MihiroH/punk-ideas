import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'

import { CommentFavorite } from '@src/commentFavorite/commentFavorite.model'
import { Idea } from '@src/idea/idea.model'
import { User } from '@src/user/user.model'

@ObjectType()
export class CommentRelationsCount {
  @Field(() => Int)
  favorites?: number
}

@ObjectType()
export class CommentRelations {
  @Field(() => User, { nullable: true })
  author?: User | null

  @Field(() => Idea, { nullable: true })
  idea?: Idea | null

  @Field(() => [CommentFavorite], { nullable: true })
  favorites?: CommentFavorite[] | null

  @Field(() => Int, { nullable: true })
  favoritesCount?: number | null

  @Field(() => Boolean, { nullable: true })
  isMyFavorite?: boolean | null

  @Field(() => CommentRelationsCount, { nullable: true })
  _count?: CommentRelationsCount | null
}

@ObjectType()
export class Comment extends CommentRelations {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  ideaId: number

  @Field(() => Int)
  authorId: number

  @HideField()
  authorIp: Buffer

  @Field()
  content: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null
}
