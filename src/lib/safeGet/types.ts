/* eslint-disable */

// Borrowed from https://github.com/react-hook-form/react-hook-form/tree/master/src/types

type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length']
  ? false
  : true
type TupleKey<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>
type ArrayKey = number
type PathImpl<K extends string | number, V> = V extends
  | ReadonlyArray<any>
  | Record<any, unknown>
  ? `${K}` | `${K}.${Path<V>}`
  : `${K}`
type Path<T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKey<T>]-?: PathImpl<K & string, T[K]>
      }[TupleKey<T>]
    : PathImpl<ArrayKey, V>
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K]>
    }[keyof T]
type ArrayPathImpl<K extends string | number, V> = IsAny<V> extends true
  ? `${K}` | `${K}.${ArrayPath<V>}`
  : V extends ReadonlyArray<infer U>
  ? U extends ReadonlyArray<any> | Record<any, unknown>
    ? `${K}` | `${K}.${ArrayPath<V>}`
    : never
  : V extends Record<any, unknown>
  ? `${K}.${ArrayPath<V>}`
  : never
type ArrayPath<T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKey<T>]-?: ArrayPathImpl<K & string, T[K]>
      }[TupleKey<T>]
    : ArrayPathImpl<ArrayKey, V>
  : {
      [K in keyof T]-?: ArrayPathImpl<K & string, T[K]>
    }[keyof T]
type PathValue<T, P extends Path<T> | ArrayPath<T>> = T extends any
  ? P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? R extends Path<T[K]>
        ? PathValue<T[K], R>
        : never
      : K extends `${ArrayKey}`
      ? T extends ReadonlyArray<infer V>
        ? PathValue<V, R & Path<V>>
        : never
      : never
    : P extends keyof T
    ? T[P]
    : P extends `${ArrayKey}`
    ? T extends ReadonlyArray<infer V>
      ? V
      : never
    : never
  : never

declare const $NestedValue: unique symbol

export type NestedValue<TValue extends object = object> = {
  [$NestedValue]: never
} & TValue
export type UnpackNestedValue<T> = T extends NestedValue<infer U>
  ? U
  : T extends Date
  ? T
  : T extends object
  ? {
      [K in keyof T]: UnpackNestedValue<T[K]>
    }
  : T

export type FieldPathValue<
  TFieldValues extends FieldValues,
  TFieldPath extends FieldPath<TFieldValues>
> = PathValue<TFieldValues, TFieldPath>

export type FieldValues = Record<string, any>

export type FieldPath<TFieldValues extends FieldValues> = Path<TFieldValues>