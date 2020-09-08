import { useState, useDebugValue } from "react";

type setStateCallback<T> = (x: T | undefined) => T | T;

const NamedState = <T>(stateName: string, stateValue: T) => {
  if (typeof stateName !== "string") {
    throw new Error("State name in useNamedState should be string");
  }
  const [customState, setCustomState] = useState({ [stateName]: stateValue });
  let namedState = customState[stateName];
  let setNamedState = (arg: setStateCallback<T>) => {
    if (typeof arg === "function") {
      setCustomState((prevState) => {
        let newState = arg(prevState[stateName]);
        return { ...prevState, [stateName]: newState };
      });
    } else {
      let newState = arg;
      setCustomState((prevState) => ({
        ...prevState,
        [stateName]: newState,
      }));
    }
  };
  return [namedState, setNamedState];
};

const DebugState = <T>(stateName: string, stateValue: T) => {
  if (typeof stateName !== "string") {
    throw new Error("State name in useDebugState should be string");
  }
  useDebugValue(stateName);
  const [customState, setCustomState] = useState(stateValue);
  return [customState, setCustomState];
};

export { NamedState as useNamedState, DebugState as useDebugState };
