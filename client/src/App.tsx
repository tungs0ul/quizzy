import React, { useState, useEffect, Suspense } from "react";
import useWebSocket from "react-use-websocket";
import useLocalStorage from "./hooks/useLocalStorage";
import StudentView from "./components/views/StudentView";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
const AdminView = React.lazy(() => import("./components/views/AdminView"));

const WSURI = "ws://localhost:8080/ws";
// const WSURI =
//   ((window.location.protocol == "https:" && "wss://") || "ws://") +
//   window.location.host +
//   "/ws";

const initQuestion = {
  msg: "question",
  data: "",
  options: [],
};

export type Question = {
  type: string;
  data: string;
  options: string[];
  uuid: string;
};

export type Result = {
  name: string;
  value: number;
};

function App() {
  const { sendMessage, lastMessage } = useWebSocket(WSURI, {
    shouldReconnect: () => true,
    reconnectInterval: 1000,
  });
  // const { sendMessage, lastMessage } = useWebSocket(WSURI);
  const [question, setQuestion] = useLocalStorage("question", initQuestion);
  const [answer, setAnswer] = useLocalStorage("answer", null);
  const [result, setResult] = useState<Result[]>([]);
  const [notice, setNotice] = useState("");
  const [active, setActive] = useState(false);
  const [intervalID, setIntervalID] = useState<NodeJS.Timer | null>(null);

  const interval = (text: string) => {
    setNotice(text);
    if (intervalID !== null) {
      clearInterval(intervalID);
    }
    let id = setInterval(() => setNotice(""), 1500);
    setIntervalID(id);
  };

  useEffect(() => {
    if (lastMessage !== null) {
      if (!lastMessage.data) {
        return;
      }
      const data = JSON.parse(lastMessage.data);
      if (data.type === "question") {
        if (data.uuid !== question.uuid) {
          setAnswer(null);
          setQuestion(data);
          setResult([]);
          interval("The question has been changed!");
        }
      } else if (data.type === "result") {
        if (
          data.data.reduce((acc: number, cur: number) => acc + cur, 0) === 0
        ) {
          setAnswer(null);
        }
        let result: Result[] = [];
        data.data.forEach((e: number, i: number) => {
          result.push({ name: question.options[i], value: e });
        });
        setResult(result);
      } else if (data.type === "clear") {
        setAnswer(null);
        let newResult = [...result];
        newResult.forEach((e: Result) => {
          e.value = 0;
        });
        setResult(newResult);
        interval("The answer has been cleared!");
      } else if (data.type === "reset") {
        setQuestion(initQuestion);
        setAnswer(null);
        setResult([]);
      } else if (data.type === "stop") {
        setActive(false);
        interval("The question has been stopped!");
      } else if (data.type === "start") {
        setActive(true);
        interval("The question has been started!");
      }
    }
  }, [lastMessage]);

  return (
    <BrowserRouter>
      <div className="h-screen relative">
        <div className="flex justify-between items-center pb-4 pr-10 header">
          <div className="cursor-pointer p-4 text-yellow-600 hover:text-green-600 text-4xl items-center h-full flex justify-center">
            <Link to="/login">Admin</Link>
          </div>
          <div className="flex justify-end tablet:text-12xl laptop:text-16xl mobile:text-6xl font-bold">
            QUIZZY
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <StudentView
                answer={answer}
                question={question}
                result={result}
                sendMessage={sendMessage}
                setAnswer={setAnswer}
                notice={notice}
                active={active}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminView
                  sendMessage={sendMessage}
                  setResult={setResult}
                  result={result}
                  question={question}
                  active={active}
                />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
