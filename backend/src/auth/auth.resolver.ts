import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/client'

import { AuthService } from './auth.service'
import { SignInInput } from './dto/signIn.input'
import { SignInResponse } from './dto/signInResponse'
import { SignUpInput } from './dto/signUp.input'
import { GqlAuthGuard } from './guards/gqlAuth.guard'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // TODO: signUp時はパスワードを受け取らず、メールアドレス認証の後で行うようにする
  //       https://chatgpt.com/share/589e5200-2d38-4cc0-ac5f-da9ed1e518ab
  @Mutation(() => Boolean)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<boolean> {
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
