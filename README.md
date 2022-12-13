# memoized-recoil-selector
Created with CodeSandbox
https://codesandbox.io/s/github/koushisa/memoized-recoil-selector

<p>In Recoil, if dependence source is an object, that entire object will be subjected to recalculation.</p>
<p>memoized-recoil-selector solve the above problem.</p>
<p>It will encapsulate access to the specific property from the target node.</p>

Includes
- `memoizedSelector`
- `selectAtom`

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

// `selectInputAtom` will return the selector that created dynamically from inputAtom
const selectInputAtom = memoizedSelector(inputAtom);

// this is equivalent to:
// const valueSelector = selector({
//   key: "inputAtom/value",
//   get: ({ get }) => get(inputAtom).value
// });
const valueSelector = selectInputAtom("value");

// Same here.
const _valueSelector = selectAtom(inputAtom, (s) => s.value);

// Inline select
const value = useRecoilValue(selectAtom(inputAtom, (s) => s.value));
```
