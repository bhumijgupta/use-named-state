import { useState, useDebugValue } from "react";

interface INamedState<T> {
  [stateName: string]: T;
}

type DebugStateFormatter<T> = (val: { state: T; extraArgs?: any }) => string;

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
    // If it is a cb function
    if (setStateCallback instanceof Function) {
      setCustomState((prevState) => {
        let requiredPrevState = prevState[stateName];
        let newState = setStateCallback(requiredPrevState);
        return { ...prevState, [stateName]: newState };
      });
    }
    // If it is direct assignment
    else {
      setCustomState((prevState) => ({
        ...prevState,
        [stateName]: setStateCallback,
      }));
    }
  };
  return [namedState, setNamedState];
};

const DebugState = <T>(
  stateName: string | DebugStateFormatter<T>,
  stateValue: T,
  extraArgs?: any
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  if (typeof stateName !== "string" && typeof stateName !== "function") {
    throw new Error(
      "State name in useDebugState should be string or a function that returns string"
    );
  }
  const [customState, setCustomState] = useState<T>(stateValue);
  if (typeof stateName === "string") useDebugValue(stateName);
  else useDebugValue({ state: customState, extraArgs }, stateName);
  return [customState, setCustomState];
};

export {
  NamedState as useNamedState,
  DebugState as useDebugState,
  DebugStateFormatter,
};
