import { Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

// NOTE: emailとpasswordの変更はここでは許可しない
@InputType()
export class UserProfileUpdateInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  username?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  nickname?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  profileImage?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  age?: number
}
