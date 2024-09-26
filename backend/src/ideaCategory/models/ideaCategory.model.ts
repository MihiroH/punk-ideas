import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Category } from '@src/category/models/category.model'

@ObjectType()
export class IdeaCategoryRelations {
  @Field(() => Category, { nullable: true })
  category?: Category | null
}

@ObjectType()
export class IdeaCategory extends IdeaCategoryRelations {
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
}
