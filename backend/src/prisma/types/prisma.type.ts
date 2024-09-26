import { Prisma, PrismaClient } from '@prisma/client'

import { CamelCase } from '@src/common/types/string.type'

export type PrismaClientError =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientUnknownRequestError
  | Prisma.PrismaClientRustPanicError
  | Prisma.PrismaClientInitializationError
  | Prisma.PrismaClientValidationError

export type ModelDelegateForUpdate = PrismaClient[keyof PrismaClient] & {
  update(args: { where: { id: number }; data: object }): Prisma.PrismaPromise<unknown>
}
export type ModelName = keyof Prisma.TypeMap['model']
export type CamelCasedModelName = CamelCase<ModelName>
export type Relations<M extends ModelName> = keyof Prisma.TypeMap['model'][M]['payload']['objects']

// biome-ignore format:
export type PrismaInclude<M extends CamelCasedModelName> =
  M extends 'category' ? Prisma.CategoryInclude :
  M extends 'comment' ? Prisma.CommentInclude :
  M extends 'idea' ? Prisma.IdeaInclude :
  M extends 'ideaCategory' ? Prisma.IdeaCategoryInclude :
  M extends 'pendingEmailChange' ? Prisma.PendingEmailChangeInclude :
  M extends 'user' ? Prisma.UserInclude :
  never
