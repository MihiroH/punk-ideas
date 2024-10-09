/*
 * 指定したプロパティ以外は禁止にする型を作成
 * 値の型は指定した型になる
 *
 * @example
 * type PartialRecord = StrictPartialRecord<'a' | 'b', string>
 * const testPartialRecord1: PartialRecord = { a: '' } // OK
 * const testPartialRecord2: PartialRecord = { a: '', b: '' } // OK
 * const testPartialRecord3: PartialRecord = { a: '', b: '', c: '' } // NG. 'c' does not exist in type 'Partial<Record<"a" | "b", string>>'.
 * const testPartialRecord4: PartialRecord = { a: 1 } // NG. Type 'number' is not assignable to type 'string'.
 */
export type StrictPartialRecord<K extends string, T = unknown> = Partial<Record<K, T>>

/*
 * 指定したプロパティを必須かつnullおよびundefinedを許容しない型
 *
 * @example
 * interface Test {
 *   id: number;
 *   name?: string | null;
 *   content?: string | null;
 * }
 *
 * type NewTest = RequiredNonNull<Test, 'name'>;
 *
 * This is equal to the following:
 *
 * interface NewTest {
 *  id: number;
 *  name: string;
 *  content?: string | null;
 *  }
 */
export type RequiredNonNull<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}
