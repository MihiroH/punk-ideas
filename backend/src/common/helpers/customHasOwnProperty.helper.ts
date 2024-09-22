import { isObject } from 'class-validator'

export const customHasOwnProperty = <T extends Record<string, unknown>>(obj: T, key: keyof T): key is keyof T => {
  return isObject(obj) && Object.prototype.hasOwnProperty.call(obj, key)
}
