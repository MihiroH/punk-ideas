import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'
import { IsIn } from 'class-validator'

import { Category } from '@src/category/category.model'
import { Comment } from '@src/comment/comment.model'
import { IdeaCategory } from '@src/ideaCategory/ideaCategory.model'
import { IdeaFavorite } from '@src/ideaFavorite/ideaFavorite.model'
import { IdeaFile } from '@src/ideaFile/ideaFile.model'
import { User } from '@src/user/user.model'
import { OPEN_LEVELS } from './constants/idea.constant'

@ObjectType()
export class IdeaRelationsCount {
  @Field(() => Int)
  comments?: number

  @Field(() => Int)
  reports?: number

  @Field(() => Int)
  favorites?: number
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

  @Field(() => [IdeaFile], { nullable: true })
  ideaFiles?: IdeaFile[] | null

  @Field(() => [IdeaFile], { nullable: true })
  files?: IdeaFile[] | null

  @Field(() => [IdeaFavorite], { nullable: true })
  favorites?: IdeaFavorite[] | null

  @Field(() => Int, { nullable: true })
  favoritesCount?: number | null

  @Field(() => Boolean, { nullable: true })
  isMyFavorite?: boolean | null

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
