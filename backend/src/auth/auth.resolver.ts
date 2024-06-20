import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/client'

import { AuthService } from './auth.service'
import { SignInInput } from './dto/signIn.input'
import { SignInResponse } from './dto/signInResponse'
import { GqlAuthGuard } from './guards/gqlAuth.guard'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => SignInResponse)
  @UseGuards(GqlAuthGuard)
  async signIn(
    @Args('signInInput') _signInInput: SignInInput,
    @Context() { user }: { user: User },
  ): Promise<SignInResponse> {
    return await this.authService.signIn(user)
  }
}
