import { ArgsType, Field } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'

@ArgsType()
export class GetUserArgs {
  @Field()
  @IsEmail()
  email: string
}
