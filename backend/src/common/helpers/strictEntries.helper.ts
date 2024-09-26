/**
 * Object.entries(object: T)の各プロパティがstring型ではなく、keyof T型になるようにした関数
 */
export const strictEntries = <T extends object>(object: T): [keyof T, T[keyof T]][] => {
  return Object.entries(object) as [keyof T, T[keyof T]][]
}
