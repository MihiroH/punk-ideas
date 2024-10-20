import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { FieldNode, GraphQLResolveInfo } from 'graphql'

export interface RequestedFieldsMap {
  [key: string]: RequestedFieldsMap
}

const parseRequestedFields = (fieldNodes: FieldNode[]): RequestedFieldsMap => {
  return fieldNodes.reduce<RequestedFieldsMap>((fields, node) => {
    if (node.selectionSet) {
      for (const selection of node.selectionSet.selections) {
        if (selection.kind === 'Field') {
          const fieldName = selection.name.value
          if (selection.selectionSet) {
            fields[fieldName] = parseRequestedFields([selection])
          } else {
            fields[fieldName] = {}
          }
        }
      }
    }
    return fields
  }, {})
}

/* GraphQLのリクエストでリクエストされたフィールドを取得するデコレータ
 * モデルに対してリクエストされたフィールドを再帰的に取得し、ネストされたマップを返す
 *
 * @returns {RequestedFieldsMap} リクエストされたフィールドのマップ
 *
 * @example
 * 以下のようなGraphQLクエリがリクエストされた場合：
 *
 * user {
 *   id
 *   name
 *   ideas {
 *     id
 *     title
 *   }
 * }
 *
 * デコレータは以下のようなオブジェクトを返す：
 * {
 *   id: {},
 *   name: {},
 *   ideas: {
 *     id: {},
 *     title: {}
 *   }
 * }
 */
export const RequestedFields = createParamDecorator((_data: unknown, context: ExecutionContext): RequestedFieldsMap => {
  const ctx = GqlExecutionContext.create(context)
  const info: GraphQLResolveInfo = ctx.getInfo()
  const parsedFields = parseRequestedFields([...info.fieldNodes])

  return parsedFields
})
