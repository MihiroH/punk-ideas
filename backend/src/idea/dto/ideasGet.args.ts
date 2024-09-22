import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsIn, IsOptional } from 'class-validator'

import { IsOrderByFieldValid } from '@src/common/decorators/isOrderByValid.decorator'
import { OrderByArgs } from '@src/common/dto/orderBy.args'
import { OPEN_LEVELS } from '../constants/idea.constant'

@ArgsType()
export class IdeasGetArgs {
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

  @Field(() => OrderByArgs || [OrderByArgs], { nullable: true })
  @IsOptional()
  @IsOrderByFieldValid(['id', 'title', 'content', 'openLevel', 'createdAt', 'updatedAt'])
  orderBy?: OrderByArgs | OrderByArgs[]
}
