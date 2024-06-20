import { Field, InputType } from '@nestjs/graphql'
import { IsIn } from 'class-validator'

import { SORT_ORDER } from '../constants/sortOrder.constant'

@InputType()
export class OrderByInput {
  @Field()
  field: string

  @Field()
  @IsIn(Object.values(SORT_ORDER), { message: `order must be either ${Object.values(SORT_ORDER).join(', ')}` })
  order: string
}
