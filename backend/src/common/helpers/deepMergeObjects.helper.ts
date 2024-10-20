import { customHasOwnProperty } from './customHasOwnProperty.helper'
import { isObject } from './typeCheck'

type NestedObject = Record<string, unknown>

interface Options {
  deleteUndefinedProps?: boolean
}

/*
 * オブジェクトを再帰的にマージする
 *
 * @example
 * deepMergeObjects([{ a: { b: 1 } }, { a: { b: 2 } }]) // => { a: { b: 2 } }
 * deepMergeObjects([{ a: { b: 1, c: 1 } }, { a: { b: 2 } }]) // => { a: { b: 1, c: 2 } }
 * deepMergeObjects([{ a: { b: 1, c: 1 } }, { a: { b: 2, c: undefined } }]) // => { a: { b: 2, c: undefined } }
 * deepMergeObjects([{ a: { b: 1, c: 1 } }, { a: { b: 2, c: undefined } }], { deleteIfUndefinedIsSpecified: true }) // => { a: { b: 2 } }
 */
export const deepMergeObjects = <T extends NestedObject[]>(objects: T, options?: Options): T[number] => {
  return objects.reduce((acc, obj) => {
    for (const key in obj) {
      if (customHasOwnProperty(obj, key)) {
        const currentValue = acc[key]
        const value = obj[key]

        // オブジェクトである場合は再帰的にマージする
        if (isObject(value)) {
          acc[key] = deepMergeObjects([isObject(currentValue) ? currentValue : {}, value], options)
        } else if (options?.deleteUndefinedProps && typeof value === 'undefined') {
          // undefinedの場合は削除
          delete acc[key]
        } else {
          // それ以外は単純に代入する
          acc[key] = value
        }
      }
    }
    return acc
  }, {})
}
