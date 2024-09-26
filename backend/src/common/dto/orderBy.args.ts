import { Field, InputType } from '@nestjs/graphql'
import { IsIn } from 'class-validator'

import { SORT_ORDER } from '../constants/sortOrder.constant'

@InputType()
export class OrderByArgs {
  @Field()
  field: string

  @Field()
  @IsIn(Object.values(SORT_ORDER), { message: `order must be one of ${Object.values(SORT_ORDER).join(', ')}` })
  order: string
}
