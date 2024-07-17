type UnknownObject = Record<PropertyKey, unknown>;
export type EmptyObjectType = Record<never, never>;

export type StringNumeric = string | number;

export type Primitive = null | undefined | string | number | boolean | symbol | bigint;

export type Optional<T> = T | undefined;

export type Nullable<T> = T | null;

export type Nullish<T> = Nullable<T> | Optional<T>;

export type Pretty<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

export type DeepPretty<T> = T extends Array<infer U>
  ? DeepPrettyArray<U>
  : T extends UnknownObject
  ? DeepPrettyObject<T>
  : T;

type DeepPrettyArray<T> = Array<DeepPretty<T>>;
type DeepPrettyObject<T> = {
  [K in keyof T]: DeepPretty<T[K]>;
};

export type MakeOptional<T> = Pretty<{
  [K in keyof T]: Optional<T[K]>;
}>;

export type MakeNullable<T> = Pretty<{
  [K in keyof T]: Nullable<T[K]>;
}>;

export type MakeNullish<T> = Pretty<{
  [K in keyof T]: Nullish<T[K]>;
}>;

export type RequireField<T extends UnknownObject, K extends keyof T> = T & Required<Pick<T, K>>;

export type PartialField<T extends UnknownObject, K extends keyof T> = T & Partial<Pick<T, K>>;

export type NeverField<T> = T extends UnknownObject ? Record<keyof T, never> : never;

export type RequireAllOrNothing<T extends UnknownObject> = Pretty<
  RequireField<T, keyof T> | Partial<NeverField<T>>
>;

export type AnyFunction = (...args: any[]) => any;

export type AnyAsyncFunction = (...args: any[]) => Promise<any>;

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<ReturnType<FnType>>;

export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>;
};

export type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false;

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type GetDeepProp<T extends object, K extends string> = K extends keyof T
  ? T[K]
  : { [P in keyof T]: GetDeepProp<Extract<T[P], object>, K> }[keyof T];

type ConvertCamelCase<S extends string> = S extends `${infer S1 extends string}_${infer S2 extends
  string}${infer S3}`
  ? `${Lowercase<S1>}${Capitalize<S2>}${ConvertCamelCase<S3>}`
  : Lowercase<S>;

export type ObjCamelCase<T> = {
  [K in keyof T as ConvertCamelCase<string & K>]: T[K];
};

export type LiteralUnion<T extends U, U extends Primitive = string> =
  | T
  | (U & {
      _?: never;
    });

export type FilterOut<T extends readonly unknown[], U extends T[number]> = T extends readonly [
  infer First,
  ...infer Rest,
]
  ? First extends U
    ? FilterOut<Rest, U>
    : [First, ...FilterOut<Rest, U>]
  : T;

export type GetUnionArrayObject<
  T extends readonly UnknownObject[],
  K extends keyof T[number],
> = T[number][K];

export type Override<T, U> = Pretty<Omit<T, keyof U> & U>;

export type DeepOverride<T, U> = T extends UnknownObject
  ? U extends UnknownObject
    ? {
        // If U is a record type, then for each key K in U, we want to either
        // use the value of U[K] (if it exists) or the value of T[K] (if it
        // exists).
        [K in keyof T]: K extends keyof U ? DeepOverride<T[K], U[K]> : T[K];
      }
    : T
  : U;

export type Split<T> = Pretty<
  // Get the keys of the object
  keyof T extends infer Keys
    ? // For each key...
      Keys extends PropertyKey
      ? // ... if it is a valid key, then...
        Keys extends keyof T
        ? // ... pick out the key and its value
          { [Prop in Keys]: T[Keys] }
        : never
      : never
    : never
>;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
