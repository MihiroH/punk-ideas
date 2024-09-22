import { Field, InputType, Int } from '@nestjs/graphql'
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator'

import { OPEN_LEVELS } from '../constants/idea.constant'

@InputType()
export class IdeaCreateInput {
  @Field()
  @IsNotEmpty()
  title: string

  @Field()
  @IsNotEmpty()
  content: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsIn(Object.values(OPEN_LEVELS), { message: `openLevel must be either ${Object.values(OPEN_LEVELS).join(', ')}` })
  openLevel?: number

  @Field(() => [Int], { nullable: true })
  categoryIds?: number[]
}