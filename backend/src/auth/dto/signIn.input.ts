import { Field, InputType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'

import { IsPasswordValid } from '@src/user/decorators/isPasswordValid.decorator'

@InputType()
export class SignInInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsPasswordValid()
  password: string
}
