import { useState, useDebugValue } from "react";

interface INamedState<T> {
  [stateName: string]: T;
}

const NamedState = <T>(
  stateName: string,
  stateValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  if (typeof stateName !== "string") {
    throw new Error("State name in useNamedState should be string");
  }
  const [customState, setCustomState] = useState<INamedState<T>>({
    [stateName]: stateValue,
  });
  let namedState = customState[stateName];
  // It either accepts cb or the new state (T)
  let setNamedState: React.Dispatch<React.SetStateAction<T>> = (
    setStateCallback
  ) => {
    if (setStateCallback instanceof Function) {
      setCustomState((prevState) => {
        let requiredPrevState = prevState[stateName];
        let newState = setStateCallback(requiredPrevState);
        return { ...prevState, [stateName]: newState };
      });
    } else {
      setCustomState((prevState) => ({
        ...prevState,
        [stateName]: setStateCallback,
      }));
    }
  };
  return [namedState, setNamedState];
};

const DebugState = <T>(
  stateName: string,
  stateValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  if (typeof stateName !== "string") {
    throw new Error("State name in useDebugState should be string");
  }
  useDebugValue(stateName);
  const [customState, setCustomState] = useState<T>(stateValue);
  return [customState, setCustomState];
};

export { NamedState as useNamedState, DebugState as useDebugState };
