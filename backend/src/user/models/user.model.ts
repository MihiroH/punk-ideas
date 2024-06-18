import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@ObjectType()
export class User {
  @Field(() => Int)
  id: number

  @Field()
  email: string

  @Field()
  username: string

  @Field()
  nickname: string

  @HideField()
  password: string

  @Field({ nullable: true })
  @IsOptional()
  profileImage: string

  @Field(() => Int)
  age: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field({ nullable: true })
  @IsOptional()
  deletedAt?: Date
}
