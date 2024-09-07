import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'
import { IsIn, IsOptional } from 'class-validator'

import { User } from '@src/user/models/user.model'
import { OPEN_LEVELS } from '../constants/idea.constant'

@ObjectType()
export class Idea {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  authorId: number

  @HideField()
  authorIp: Buffer

  @Field()
  title: string

  @Field()
  content: string

  @Field(() => Int)
  @IsIn(Object.values(OPEN_LEVELS), { message: `openLevel must be either ${Object.values(OPEN_LEVELS).join(', ')}` })
  openLevel: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field({ nullable: true })
  @IsOptional()
  deletedAt?: Date

  @Field(() => User, { nullable: true })
  @IsOptional()
  author?: User
}
