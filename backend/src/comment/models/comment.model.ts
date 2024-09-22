import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

import { Idea } from '@src/idea/models/idea.model'
import { User } from '@src/user/models/user.model'

@ObjectType()
export class Comment {
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

  @Field({ nullable: true })
  deletedAt: Date | null

  @Field(() => User, { nullable: true })
  @IsOptional()
  author?: User

  @Field(() => Idea, { nullable: true })
  @IsOptional()
  idea?: Idea
}
