import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

import { Comment } from '@src/comment/models/comment.model'
import { Idea } from '@src/idea/models/idea.model'

@ObjectType()
class UserRelationsCount {
  @Field(() => Int, { nullable: true })
  ideas?: number

  @Field(() => Int, { nullable: true })
  comments?: number

  @Field(() => Int, { nullable: true })
  reports?: number
}

@ObjectType()
export class UserRelations {
  @Field(() => [Idea], { nullable: true })
  @IsOptional()
  ideas?: Idea[]

  @Field(() => Int, { nullable: true })
  @IsOptional()
  ideasCount?: number

  @Field(() => [Comment], { nullable: true })
  @IsOptional()
  comments?: Comment[]

  @Field(() => Int, { nullable: true })
  @IsOptional()
  commentsCount?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  reportsCount?: number

  @Field(() => UserRelationsCount, { nullable: true })
  @IsOptional()
  _count?: UserRelationsCount
}

@ObjectType()
export class User extends UserRelations {
  @Field(() => Int)
  id: number

  @Field()
  email: string

  @Field()
  username: string

  @Field({ nullable: true })
  @IsOptional()
  nickname?: string

  @HideField()
  password: string

  @Field({ nullable: true })
  @IsOptional()
  profileImage?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  age?: number

  @Field({ nullable: true })
  @IsOptional()
  emailVerifiedAt?: Date

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field({ nullable: true })
  deletedAt: Date | null
}
