export type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer Rest}`
  ? `${Lowercase<P1>}${Capitalize<Lowercase<P2>>}${CamelCase<Rest>}`
  : S extends `${infer First}${infer Rest}`
    ? `${Lowercase<First>}${Rest}`
    : S
