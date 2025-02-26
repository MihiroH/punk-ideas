import { ArgsType, Field, IntersectionType } from '@nestjs/graphql'
import { ArrayNotEmpty, IsOptional } from 'class-validator'

import { IsOrderByFieldValid } from '@src/common/decorators/isOrderByValid.decorator'
import { OrderByArgs } from '@src/common/dto/orderBy.args'
import { PaginationArgs } from '@src/common/dto/pagination.args'
import { IdeasGetBaseArgs } from './ideasGetBase.args'

@ArgsType()
export class IdeasGetArgs extends IntersectionType(IdeasGetBaseArgs, PaginationArgs) {
  @Field(() => [OrderByArgs], { nullable: true })
  @IsOptional()
  @ArrayNotEmpty()
  @IsOrderByFieldValid(['id', 'title', 'content', 'openLevel', 'createdAt', 'updatedAt'])
  orderBy?: OrderByArgs[]
}
