import {
  RecoilState,
  RecoilValueReadOnly,
  selector,
  selectorFamily
} from "recoil";
import { nanoid } from "../nanoid";
import { safeGet } from "../safeGet/safeGet";
import { FieldPath, FieldPathValue, FieldValues } from "../safeGet/types";

type MemoizedSelector<TFieldValues extends FieldValues> = {
  <TFieldName extends FieldPath<TFieldValues>>(
    name: TFieldName
  ): RecoilValueReadOnly<FieldPathValue<TFieldValues, TFieldName>>;
};

/** Stringify atom to Cache  */
const atomWithStringify = <T>(target: RecoilState<T>, key = nanoid()) => {
  const stringified = selector({
    key: `${target.key}/memo/${key}`,
    get: ({ get }) => {
      const obj = get(target);

      return JSON.stringify(obj);
    }
  });

  return stringified;
};

/**
 * In Recoil, if dependence source is an object, that entire object will be subjected to recalculation.
 * this function makes a memoized selector that is encapsulate access to the specific property from the target node.
 */
export const memoizedSelector = <T>(
  target: RecoilState<T>
): MemoizedSelector<T> => {
  const memo = atomWithStringify(target);

  // Make References only specified property
  return selectorFamily({
    key: `${memo.key}/getter`,
    get: (property) => ({ get }) => {
      const obj: FieldValues = JSON.parse(get(memo));

      return safeGet(obj, property);
    }
  });
};

export const selectAtom = <T, R>(
  target: RecoilState<T>,
  select: (src: T) => R
) => {
  const memo = atomWithStringify(target);

  // Create a Selector by delegated select func
  return selector({
    key: `${memo.key}/selected`,
    get: ({ get }) => {
      const obj: T = JSON.parse(get(memo));

      return select(obj);
    }
  });
};
