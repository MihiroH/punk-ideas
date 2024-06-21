import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/client'

import { User as UserModel } from '@src/user/models/user.model'
import { AuthService } from './auth.service'
import { SignInInput } from './dto/signIn.input'
import { SignInResponse } from './dto/signInResponse'
import { SignUpInput } from './dto/signUp.input'
import { GqlAuthGuard } from './guards/gqlAuth.guard'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserModel)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<User> {
    return await this.authService.signUp(signUpInput)
  }

  @Mutation(() => SignInResponse)
  @UseGuards(GqlAuthGuard)
  async signIn(
    @Args('signInInput') _signInInput: SignInInput,
    @Context() { user }: { user: User },
  ): Promise<SignInResponse> {
    return await this.authService.signIn(user)
  }
}
