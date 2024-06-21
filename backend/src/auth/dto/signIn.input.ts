import { Field, InputType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'

import { IsPasswordValid } from '@src/user/validators/password.validation'

@InputType()
export class SignInInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsPasswordValid()
  password: string
}
