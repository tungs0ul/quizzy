import TestRenderer, { act } from "react-test-renderer";
import { Result } from "../../App";
import * as React from "react";
import Login from "../views/admin/Login";

jest.mock("axios");
const setIsAdmin = jest.fn();

it("render Login", () => {
  const test = TestRenderer.create(<Login setIsAdmin={setIsAdmin} />);
  const testInstance = test.root;
  expect(test.toJSON()).toMatchSnapshot();

  const mEvent = { target: { value: "teresa teng" } };
  act(() => {
    testInstance.findByType("input").props.onChange(mEvent);
  });
  expect(testInstance.findByType("input").props.value).toEqual("teresa teng");
});
