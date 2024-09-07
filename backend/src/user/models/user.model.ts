import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

import { Idea } from '@src/idea/models/idea.model'

@ObjectType()
export class User {
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
  @IsOptional()
  deletedAt?: Date

  @Field(() => [Idea], { nullable: true })
  @IsOptional()
  ideas?: Idea[]
}
