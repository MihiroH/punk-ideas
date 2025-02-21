import { Field, HideField, ObjectType } from '@nestjs/graphql'

import { User } from '@src/user/user.model'

@ObjectType()
export class SignInResponse {
  @Field()
  accessToken: string

  @HideField()
  refreshToken: string

  @Field(() => User)
  user: User
}
