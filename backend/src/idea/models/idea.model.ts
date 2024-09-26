import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'
import { IsIn } from 'class-validator'

import { Category } from '@src/category/models/category.model'
import { Comment } from '@src/comment/models/comment.model'
import { IdeaCategory } from '@src/ideaCategory/models/ideaCategory.model'
import { User } from '@src/user/models/user.model'
import { OPEN_LEVELS } from '../constants/idea.constant'

@ObjectType()
export class IdeaRelationsCount {
  @Field(() => Int)
  comments?: number

  @Field(() => Int)
  reports?: number
}

@ObjectType()
export class IdeaRelations {
  @Field(() => User, { nullable: true })
  author?: User | null

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[] | null

  @Field(() => Int, { nullable: true })
  commentsCount?: number | null

  @Field(() => Int, { nullable: true })
  reportsCount?: number | null

  @Field(() => [IdeaCategory], { nullable: true })
  ideaCategories?: IdeaCategory[] | null

  @Field(() => [Category], { nullable: true })
  categories?: Category[] | null

  @Field(() => IdeaRelationsCount, { nullable: true })
  _count?: IdeaRelationsCount | null
}

@ObjectType()
export class Idea extends IdeaRelations {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  authorId: number

  @HideField()
  authorIp: Buffer

  @Field()
  title: string

  @Field()
  content: string

  @Field(() => Int)
  @IsIn(Object.values(OPEN_LEVELS), { message: `openLevel must be either ${Object.values(OPEN_LEVELS).join(', ')}` })
  openLevel: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null
}
