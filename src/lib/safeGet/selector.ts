import { FieldValues } from "./types";

export function select<TFieldValues extends FieldValues, R>(
  obj: TFieldValues,
  selector: (obj: TFieldValues) => R
): R {
  return selector(obj);
}

export function createSelector<TFieldValues extends FieldValues>(
  obj: TFieldValues
) {
  const selector = <R>(selector: (obj: TFieldValues) => R) => {
    return select(obj, selector);
  };

  return selector;
}
