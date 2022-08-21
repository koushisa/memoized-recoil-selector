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
 * In Recoil, if the dependence source of a selector is an object, the entire corresponding object is subject to recalculation.
 * To solve the above problem, create a proxy to the node of the dependence source and encapsulate access to the specific property.
 */
export const memoizedSelector = <T>(
  target: RecoilState<T>
): MemoizedSelector<T> => {
  // Cache stringified object in selector.
  const memo = selector({
    key: `${target.key}/memo`,
    get: ({ get }) => {
      const obj = get(target);

      return JSON.stringify(obj);
    }
  });

  // Make references to specific properties only
  return selectorFamily({
    key: `${memo.key}/getter`,
    get: (property) => ({ get }) => {
      const obj: FieldValues = JSON.parse(get(memo));

      return safeGet(obj, property);
    }
  });
};
