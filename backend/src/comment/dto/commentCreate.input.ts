import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class CommentCreateInput {
  @Field(() => Int)
  ideaId: number

  @Field()
  @IsNotEmpty()
  content: string
}
