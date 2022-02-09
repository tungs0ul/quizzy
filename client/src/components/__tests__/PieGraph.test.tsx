import PieGraph from "../graph/PieGraph";
import TestRenderer, { act } from "react-test-renderer";
import { Result } from "../../App";
import * as React from "react";

const data = [
  { name: "1", value: 1 },
  { name: "2", value: 1 },
];

it("render piegraph", () => {
  const test = TestRenderer.create(<PieGraph data={data} resize={true} />);
  act(() => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));
    expect(test.toJSON()).toMatchSnapshot();
  });
});
