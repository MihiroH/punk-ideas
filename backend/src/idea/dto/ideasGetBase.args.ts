import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsIn, IsOptional } from 'class-validator'

import { OPEN_LEVELS } from '../constants/idea.constant'

@ArgsType()
export class IdeasGetBaseArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  title?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  content?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsIn(Object.values(OPEN_LEVELS), { message: `openLevel must be either ${Object.values(OPEN_LEVELS).join(', ')}` })
  openLevel?: number

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  includeReportedBySelf?: boolean
}
