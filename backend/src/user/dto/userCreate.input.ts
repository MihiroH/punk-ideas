import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

import { IsPasswordValid } from '../decorators/isPasswordValid.decorator'

@InputType()
export class UserCreateInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsNotEmpty()
  username: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  nickname?: string

  @Field()
  @IsPasswordValid()
  password: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  profileImage?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  age?: number
}
