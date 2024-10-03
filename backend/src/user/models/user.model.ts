import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'

import { Comment } from '@src/comment/models/comment.model'
import { Idea } from '@src/idea/models/idea.model'

@ObjectType()
export class UserRelationsCount {
  @Field(() => Int)
  ideas?: number

  @Field(() => Int)
  comments?: number

  @Field(() => Int)
  reports?: number
}

@ObjectType()
export class UserRelations {
  @Field(() => [Idea])
  ideas?: Idea[]

  @Field(() => Int, { nullable: true })
  ideasCount?: number | null

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[] | null

  @Field(() => Int, { nullable: true })
  commentsCount?: number | null

  @Field(() => Int, { nullable: true })
  reportsCount?: number | null

  @Field(() => UserRelationsCount, { nullable: true })
  _count?: UserRelationsCount | null
}

@ObjectType()
export class User extends UserRelations {
  @Field(() => Int)
  id: number

  @Field()
  email: string

  @Field()
  username: string

  @Field(() => String, { nullable: true })
  nickname: string | null

  @HideField()
  password: string

  @Field(() => String, { nullable: true })
  profileImage: string | null

  @Field(() => Int, { nullable: true })
  age: number | null

  @Field(() => Date, { nullable: true })
  emailVerifiedAt: Date | null

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null
}
