# memoized-recoil-selector
Created with CodeSandbox

<p>In Recoil, if the dependence source of a selector is an object, the entire corresponding object is subject to recalculation.</p>
<p>memoizedSelector solve the above problem. this is a proxy to the node of the dependence source and encapsulate access to the specific property.</p>

```tsx
type Input = {
  name: string;
  value: string;
};

const inputAtom = atom<Input>({
  key: "inputAtom",
  default: {
    name: "name",
    value: "value"
  }
});

// `memoizedInputAtom` will return the selector that created dynamically from inputAtom
const memoizedInputAtom = memoizedSelector(inputAtom);

// this is equivalent to:
// const valueSelector = selector({
//   key: "inputAtom/value",
//   get: ({ get }) => get(inputAtom).value
// });
const valueSelector = memoizedInputAtom("value");
```
