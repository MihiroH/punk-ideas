import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

import { IsPasswordValid } from '../validators/password.validation'

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsNotEmpty()
  username: string

  @Field({ nullable: true })
  @IsOptional()
  nickname?: string

  @Field()
  @IsPasswordValid()
  password: string

  @Field({ nullable: true })
  @IsOptional()
  profileImage?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  age?: number
}
