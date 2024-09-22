import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { GraphQLResolveInfo, SelectionNode } from 'graphql'

/* GraphQLのリクエストでリクエストされたフィールドを取得するデコレータ
 * モデルに対してリクエストされた1階層目のフィールドを取得する
 *
 * @returns {string[]} リクエストされたフィールドの配列
 *
 * @example
 * リクエストされたフィールドが以下の場合、['id', 'name', 'ideas']を返す
 *
 * user {
 *   id
 *   name
 *   ideas {
 *     id
 *     title
 *   }
 * }
 */
export const RequestedFields = createParamDecorator((_data: unknown, context: ExecutionContext): string[] => {
  const ctx = GqlExecutionContext.create(context)
  const info: GraphQLResolveInfo = ctx.getInfo()

  return info.fieldNodes[0].selectionSet.selections
    .map((field: SelectionNode) => ('name' in field ? field.name.value : ''))
    .filter(Boolean)
})
