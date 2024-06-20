import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsIn, IsOptional } from 'class-validator'

import { OrderByInput } from '@src/common/dto/orderBy.args'
import { IsOrderByFieldValid } from '@src/common/validators/isOrderByValid.validator'
import { OPEN_LEVELS } from '../constants'

@ArgsType()
export class GetIdeasArgs {
  @Field({ nullable: true })
  @IsOptional()
  title: string

  @Field({ nullable: true })
  @IsOptional()
  content: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsIn(Object.values(OPEN_LEVELS), { message: `openLevel must be either ${Object.values(OPEN_LEVELS).join(', ')}` })
  openLevel?: number

  @Field(() => OrderByInput || [OrderByInput], { nullable: true })
  @IsOptional()
  @IsOrderByFieldValid(['id', 'title', 'content', 'openLevel', 'createdAt', 'updatedAt'])
  orderBy?: OrderByInput | OrderByInput[]
}
