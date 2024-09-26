import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'

import { Idea } from '@src/idea/models/idea.model'
import { User } from '@src/user/models/user.model'

@ObjectType()
export class CommentRelations {
  @Field(() => User, { nullable: true })
  author?: User | null

  @Field(() => Idea, { nullable: true })
  idea?: Idea | null
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
