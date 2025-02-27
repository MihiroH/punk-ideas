import { Type } from '@nestjs/common'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage: boolean

  @Field()
  hasPreviousPage: boolean

  @Field(() => String, { nullable: true })
  startCursor: string | null

  @Field(() => String, { nullable: true })
  endCursor: string | null
}

export interface Edge<T> {
  cursor: string
  node: T
}

export interface Connection<T> {
  edges: Edge<T>[]
  pageInfo: PageInfo
  totalCount: number
}

export function createConnectionType<T>(NodeType: Type<T>): Type<Connection<T>> {
  @ObjectType(`${NodeType.name}Edge`)
  class EdgeType implements Edge<T> {
    @Field(() => String)
    cursor: string

    @Field(() => NodeType)
    node: T
  }

  @ObjectType(`${NodeType.name}Connection`)
  class ConnectionType implements Connection<T> {
    @Field(() => [EdgeType])
    edges: EdgeType[]

    @Field(() => PageInfo)
    pageInfo: PageInfo

    @Field(() => Int)
    totalCount: number
  }

  return ConnectionType
}
