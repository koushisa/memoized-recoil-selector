import {
  RecoilState,
  RecoilValueReadOnly,
  selector,
  selectorFamily
} from "recoil";
import { safeGet } from "../safeGet/safeGet";
import { FieldPath, FieldPathValue, FieldValues } from "../safeGet/types";

type MemoizedSelector<TFieldValues extends FieldValues> = {
  <TFieldName extends FieldPath<TFieldValues>>(
    name: TFieldName
  ): RecoilValueReadOnly<FieldPathValue<TFieldValues, TFieldName>>;
};

/**
 * In Recoil, if dependence source is an object, that entire object will be subjected to recalculation.
 * this function makes a memoized selector that is encapsulate access to the specific property from the target node.
 */
export const memoizedSelector = <T>(
  target: RecoilState<T>
): MemoizedSelector<T> => {
  // Cache stringified object
  const memo = selector({
    key: `${target.key}/memo`,
    get: ({ get }) => {
      const obj = get(target);

      return JSON.stringify(obj);
    }
  });

  // Make References only specified property
  return selectorFamily({
    key: `${memo.key}/getter`,
    get: (property) => ({ get }) => {
      const obj: FieldValues = JSON.parse(get(memo));

      return safeGet(obj, property);
    }
  });
};
