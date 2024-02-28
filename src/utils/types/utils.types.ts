type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type MergeUnion<U> = UnionToIntersection<U> extends infer O ? { [K in keyof O]: O[K] } : never;
