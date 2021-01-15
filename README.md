# use-named-hook

React hook to use named state for easier debugging with almost no code change

## Motivation

Most of the time I edit state values directly in react devtools to achieve different state during development. But if there are too many states in a functional component, it gets tricky to know which state is what since they are represented without names in devtools. This is a way to solve that problem by naming the states.

| Before                         | After                        |
| ------------------------------ | ---------------------------- |
| ![Before](./assets/before.png) | ![After](./assets/after.png) |

## Available hooks

1. `useDebugState()` - Recommended
   It uses [useDebugValue](https://reactjs.org/docs/hooks-reference.html#usedebugvalue) internally to set debug name for the custom hook.  
    **Usage**

   ```typescript
   import * as react from "react";
   import { useDebugState } from "use-named-state";
   const App = () => {
     const [counter, setCounter] = useDebugState("counter", 0);

     return <button onClick={(prevCount) => prevCount + 1}>{counter}</button>;
   };
   ```

   **Result**
   ![Output of useDebugState](./assets/debugState.png)

2. `useNamedState()`
   It creates an object with key as state name and value as state.

   ```typescript
   import * as react from "react";
   import { useNamedState } from "use-named-state";
   const App = () => {
     const [counter, setCounter] = useNamedState("counter", 0);

     return <button onClick={(prevCount) => prevCount + 1}>{counter}</button>;
   };
   ```

   **Result**
   ![Output of useNamedState](./assets/namedState.png)

## Difference

If you use `useDebugState`, the state name is not leaked to the production build.  
If you use `useNamedState`, the state names are leaked to the production build as well, as the state name is the part of state and not just a label. **This might not be an intended side-effect**
