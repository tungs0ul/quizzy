import TestRenderer, { act } from "react-test-renderer";
import { Result, Question } from "../../App";
import * as React from "react";
import StudentView from "../views/StudentView";

const answer = null;
const setAnswer = jest.fn();
const sendMessage = jest.fn();
const question: Question = {
  type: "question",
  data: "Yes Or No",
  options: ["Yes", "No"],
  uuid: "1",
};
const result: Result[] = [];
const notice = "";
const active = true;

it("render student view without notice", () => {
  const test = TestRenderer.create(
    <StudentView
      answer={answer}
      setAnswer={setAnswer}
      question={question}
      active={active}
      notice={notice}
      sendMessage={sendMessage}
      result={result}
    />
  );
  const x = test.root.findAllByType("span")[0];
  x.props.onClick();
  expect(test.toJSON()).toMatchSnapshot();
});

it("render student view with notice", () => {
  const test2 = TestRenderer.create(
    <StudentView
      answer={answer}
      setAnswer={setAnswer}
      question={question}
      active={active}
      notice={"hello"}
      sendMessage={sendMessage}
      result={result}
    />
  );

  expect(test2.toJSON()).toMatchSnapshot();
});
