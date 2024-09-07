import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PendingEmailChange {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  userId: number

  @Field()
  email: string

  @Field()
  token: string

  @Field()
  createdAt: Date
}
