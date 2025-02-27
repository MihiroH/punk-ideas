import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsOptional, Min } from 'class-validator'

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  first?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  after?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  last?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  before?: string
}
