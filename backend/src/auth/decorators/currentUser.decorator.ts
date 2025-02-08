import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { User } from '@src/user/user.model'

export const AuthenticatedUser = createParamDecorator((_data: unknown, context: ExecutionContext): User => {
  const ctx = GqlExecutionContext.create(context)
  return ctx.getContext().req.user
})
