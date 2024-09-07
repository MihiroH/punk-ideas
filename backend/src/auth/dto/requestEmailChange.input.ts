import { Field, InputType } from '@nestjs/graphql'

import { IsPasswordValid } from '@src/user/validators/password.validation'
import { IsEmail } from 'class-validator'

@InputType()
export class RequestEmailChangeInput {
  @Field()
  @IsEmail()
  newEmail: string

  @Field()
  @IsPasswordValid()
  currentPassword: string
}
