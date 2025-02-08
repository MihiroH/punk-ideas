import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Comment } from '@src/comment/comment.model'
import { User } from '@src/user/user.model'

@ObjectType()
export class CommentFavoriteRelations {
  @Field(() => User, { nullable: true })
  user?: User | null

  @Field(() => Comment, { nullable: true })
  comment?: Comment | null
}

@ObjectType()
export class CommentFavorite extends CommentFavoriteRelations {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  userId: number

  @Field(() => Int)
  commentId: number

  @Field()
  createdAt: Date
}
