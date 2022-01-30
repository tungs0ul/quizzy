import React, { useEffect, useState } from "react";
import { SendMessage } from "react-use-websocket";
import ResultView from "./admin/ResultView";
import { Result, Question } from "../../App";
import Sidebar from "./admin/Sidebar";
import QuestionView from "./admin/QuestionView";
import Login from "./admin/Login";

type Props = {
  sendMessage: SendMessage;
  result: Result[];
  question: any;
  setResult: React.Dispatch<React.SetStateAction<Result[]>>;
  active: boolean;
};

const initQuestion: Question = {
  type: "question",
  data: "Yes or No?",
  options: ["Yes", "No"],
};

export default function AdminView({
  sendMessage,
  result,
  question,
  setResult,
  active,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([initQuestion]);

  const [isAdmin, setIsAdmin] = useState(false);

  const sendQuestion = (question: Question) =>
    sendMessage(JSON.stringify(question));
  const clearResult = () => {
    sendMessage(JSON.stringify({ type: "clear", data: "" }));
    setResult([]);
  };

  const addQuestions = (questions: Question[]) => {
    let newQuestions = [initQuestion, ...questions];
    setQuestions(newQuestions);
  };

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth < 500);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  if (!isAdmin) {
    return <Login setIsAdmin={setIsAdmin} />;
  }

  return (
    <div className="flex justify-between relative h-full">
      <Sidebar
        questions={questions}
        sendQuestion={sendQuestion}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div
        className="flex mobile:flex-col laptop:flex-row relative z-0"
        style={{
          width: "calc(100vw - 60px)",
          overflowX: "hidden",
        }}
      >
        <QuestionView addQuestions={addQuestions} sendQuestion={sendQuestion} />
        <ResultView
          result={result}
          mobileView={mobileView}
          question={question}
          clearResult={clearResult}
          sendMessage={sendMessage}
          active={active}
        />
      </div>
    </div>
  );
}
