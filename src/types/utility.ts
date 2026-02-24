export type InferArray<T> = T extends Array<infer ElementType> ? ElementType : never;
