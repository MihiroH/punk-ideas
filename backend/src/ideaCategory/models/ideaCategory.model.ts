import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Category } from '@src/category/models/category.model'

@ObjectType()
export class IdeaCategory {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  ideaId: number

  @Field(() => Int)
  categoryId: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => Category)
  category?: Category
}
