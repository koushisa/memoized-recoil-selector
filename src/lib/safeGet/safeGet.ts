/* eslint-disable */

import { FieldValues, FieldPath, FieldPathValue } from "./types";

// Borrowed from https://github.com/angus-c/just/blob/master/packages/object-safe-get/index.js

//  const obj = { a: { aa: { aaa: 2 } }, b: 4 };
// get(obj, 'a.aa.aaa'); // 2
// get(obj, ['a', 'aa', 'aaa']); // 2
// get(obj, 'b.bb.bbb'); // undefined
// get(obj, ['b', 'bb', 'bbb']); // undefined
// get(obj.a, 'aa.aaa'); // 2
// get(obj.a, ['aa', 'aaa']); // 2
// get(obj.b, 'bb.bbb'); // undefined
// get(obj.b, ['bb', 'bbb']); // undefined
// get(obj.b, 'bb.bbb', 42); // 42
// get(obj.b, ['bb', 'bbb'], 42); // 42
// get(null, 'a'); // undefined
// get(undefined, ['a']); // undefined
// get(null, 'a', 42); // 42
// get(undefined, ['a'], 42); // 42
// const obj = { a: {} };
// const sym = Symbol();
// obj.a[sym] = 4;
// get(obj.a, sym); // 4

export function safeGet<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(
  obj: TFieldValues,
  name: TFieldName,
  defaultValue?: any
): FieldPathValue<TFieldValues, TFieldName> {
  if (!obj) {
    return defaultValue;
  }
  let props, prop;
  if (Array.isArray(name)) {
    props = name.slice(0);
  }
  if (typeof name == "string") {
    props = name.split(".");
  }
  if (typeof name == "symbol") {
    props = [name];
  }
  if (!Array.isArray(props)) {
    throw new Error("props arg must be an array, a string or a symbol");
  }
  while (props.length) {
    prop = props.shift();
    if (!obj) {
      return defaultValue;
    }
    obj = obj[prop as any];
    if (obj === undefined) {
      return defaultValue;
    }
  }
  return obj as any;
}
