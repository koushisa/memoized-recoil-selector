import React from "react";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { memoizedSelector } from "./lib/recoil/memoizedSelector";

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

// this is same as :
// const valueSelector = selector({
//   key: "inputAtom/value",
//   get: ({ get }) => get(inputAtom).value
// });
const valueSelector = memoizedInputAtom("value");

let valueRenderCount = 0;
const Value = () => {
  valueRenderCount++;

  // const value = useRecoilValue(valueSelector);
  const { value } = useRecoilValue(inputAtom);

  return (
    <>
      <h2>Value</h2>
      <p>Value: {value}</p>
      <p>Render: {valueRenderCount}</p>
    </>
  );
};

let memoizedValueRenderCount = 0;
const MemoizedValue = () => {
  memoizedValueRenderCount++;

  const value = useRecoilValue(memoizedInputAtom("value"));

  return (
    <>
      <h2>MemoizedValue</h2>
      <p>Value: {value}</p>
      <p>Render: {memoizedValueRenderCount}</p>
    </>
  );
};

const Form = () => {
  const [input, setInput] = useRecoilState(inputAtom);

  return (
    <form>
      <div>
        <label>name: </label>
        <input
          value={input.name}
          onChange={(e) => {
            setInput((current) => ({ ...current, name: e.target.value }));
          }}
        />
      </div>

      <div>
        <label>value: </label>
        <input
          value={input.value}
          onChange={(e) => {
            setInput((current) => ({ ...current, value: e.target.value }));
          }}
        />
      </div>
    </form>
  );
};

let mainRenderCount = 0;
export const Main: React.FC = () => {
  mainRenderCount++;
  return (
    <main>
      <h1>Main</h1>
      <p>Render: {mainRenderCount}</p>
      <p>What happens if the `name` is changed?</p>
      <Form />
      <Value />
      <MemoizedValue />
    </main>
  );
};
