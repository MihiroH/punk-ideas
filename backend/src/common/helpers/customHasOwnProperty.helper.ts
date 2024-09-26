import { isObject } from './typeCheck'

export const customHasOwnProperty = <T extends Record<string, unknown>>(
  object: T,
  key: string | number | symbol,
): key is keyof T => {
  return isObject(object) && Object.prototype.hasOwnProperty.call(object, key)
}
