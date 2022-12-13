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

/** Stringify atom for caching  */
const atomWithStringify = <T>(src: RecoilState<T>, key = nanoid()) => {
  const stringified = selector({
    key: `${src.key}/stringified/${key}`,
    get: ({ get }) => {
      return JSON.stringify(get(src));
    }
  });

  return stringified;
};

/**
 * In Recoil, if dependence source is an object, that entire object will be subjected to recalculation.
 * this function makes a memoized selector that is encapsulate access to the specific property from the target node.
 */
export const memoizedSelector = <T>(
  src: RecoilState<T>
): MemoizedSelector<T> => {
  const memo = atomWithStringify(src);

  // Make References only specified property
  return selectorFamily({
    key: `${memo.key}/getter`,
    get: (property) => ({ get }) => {
      const src: FieldValues = JSON.parse(get(memo));

      return safeGet(src, property);
    }
  });
};

export const selectAtom = <T, R>(
  src: RecoilState<T>,
  select: (src: T) => R
) => {
  const memo = atomWithStringify(src);

  // Create a Selector from delegated select func
  return selector({
    key: `${memo.key}/selected`,
    get: ({ get }) => {
      const src: T = JSON.parse(get(memo));

      return select(src);
    }
  });
};
