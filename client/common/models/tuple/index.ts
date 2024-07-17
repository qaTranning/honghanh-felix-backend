export type TupleWithLength<T, L extends number, A extends T[] = []> = A['length'] extends L
  ? A
  : TupleWithLength<T, L, [T, ...A]>;
