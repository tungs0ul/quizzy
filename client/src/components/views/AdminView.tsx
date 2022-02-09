import React, { useEffect, useState } from "react";
import { SendMessage } from "react-use-websocket";
import ResultView from "./admin/ResultView";
import { Result, Question } from "../../App";
import Sidebar from "./admin/Sidebar";
import QuestionView from "./admin/QuestionView";
import Login from "./admin/Login";
import { v4 as uuidv4 } from "uuid";

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
  uuid: uuidv4().toString(),
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

  const [newQuestion, setNewQuestion] = useState<Question>({
    type: "question",
    data: "",
    options: ["", ""],
    uuid: uuidv4().toString(),
  });

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
    <div className="flex justify-between relative h-fit w-full ">
      <Sidebar
        questions={questions}
        sendQuestion={sendQuestion}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setNewQuestion={setNewQuestion}
      />
      <div className="flex mobile:flex-col laptop:flex-row z-0 w-full mobile:h-fit h-full gap-4">
        <QuestionView
          addQuestions={addQuestions}
          sendQuestion={sendQuestion}
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
        />
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
