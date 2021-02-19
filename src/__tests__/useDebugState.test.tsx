import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { useDebugState, DebugStateFormatter } from "../index";
function DebugStateSimple() {
  const renderCount = React.useRef(1);
  const [input, setInput] = useDebugState<string>("input", "");
  React.useEffect(() => {
    renderCount.current = renderCount.current + 1;
  }, [input]);
  return (
    <div>
      <input
        placeholder="Enter name"
        onChange={(e) => {
          setInput(e.target.value);
        }}
        value={input}
      />
      <span aria-label="render-count">{renderCount.current}</span>
    </div>
  );
}

const debugStateFormatter: DebugStateFormatter<string> = ({
  state,
  extraArgs,
}) => {
  return `name - ${state} - ${extraArgs.metadata}`;
};

function DebugStateWithStringFormatter() {
  const renderCount = React.useRef(1);
  const [input, setInput] = useDebugState<string>(debugStateFormatter, "", {
    metadata: "about-me",
  });
  React.useEffect(() => {
    renderCount.current = renderCount.current + 1;
  }, [input]);
  return (
    <div>
      <input
        placeholder="Enter name"
        onChange={(e) => {
          setInput(e.target.value);
        }}
        value={input}
      />
      <span aria-label="render-count">{renderCount.current}</span>
    </div>
  );
}

afterEach(() => {
  jest.clearAllMocks();
});

test("useDebugState with string state", () => {
  jest.spyOn(React, "useDebugValue");
  const { getByPlaceholderText, getByLabelText } = render(<DebugStateSimple />);
  expect(React.useDebugValue).toHaveBeenCalledWith("input");
  const input = getByPlaceholderText("Enter name");
  expect((input as HTMLInputElement).value).toBe("");
  fireEvent.change(input, { target: { value: "2" } });
  fireEvent.change(input, { target: { value: "23" } });
  expect((input as HTMLInputElement).value).toBe("23");
  const renderCount = getByLabelText("render-count");
  expect(renderCount.textContent).toBe("3");
});

test("useDebugState with formatter function", () => {
  jest.spyOn(React, "useDebugValue");
  const { getByPlaceholderText, getByLabelText } = render(
    <DebugStateWithStringFormatter />
  );
  expect(React.useDebugValue).toHaveBeenCalledWith(
    { state: "", extraArgs: { metadata: "about-me" } },
    debugStateFormatter
  );
  const input = getByPlaceholderText("Enter name");
  expect((input as HTMLInputElement).value).toBe("");
  fireEvent.change(input, { target: { value: "bhumij" } });
  expect(React.useDebugValue).toHaveBeenCalledWith(
    { state: "bhumij", extraArgs: { metadata: "about-me" } },
    debugStateFormatter
  );
  const renderCount = getByLabelText("render-count");
  expect(renderCount.textContent).toBe("2");
});

test("useDebugState with non-string state name should throw error", () => {
  expect(() =>
    useDebugState<string>(({ name: "blah" } as unknown) as string, "abc")
  ).toThrowError(
    "State name in useDebugState should be string or a function that returns string"
  );
});
