import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Idea } from '@src/idea/models/idea.model'
import { User } from '@src/user/models/user.model'

@ObjectType()
export class IdeaFileRelations {
  @Field(() => User, { nullable: true })
  user?: User | null

  @Field(() => Idea, { nullable: true })
  idea?: Idea | null
}

@ObjectType()
export class IdeaFile extends IdeaFileRelations {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  ideaId: number

  @Field()
  filePath: string

  @Field()
  createdAt: Date
}
