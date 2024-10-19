import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Idea } from '@src/idea/models/idea.model'
import { User } from '@src/user/models/user.model'

@ObjectType()
export class IdeaFavoriteRelations {
  @Field(() => User, { nullable: true })
  user?: User | null

  @Field(() => Idea, { nullable: true })
  idea?: Idea | null
}

@ObjectType()
export class IdeaFavorite extends IdeaFavoriteRelations {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  userId: number

  @Field(() => Int)
  ideaId: number

  @Field()
  createdAt: Date
}
