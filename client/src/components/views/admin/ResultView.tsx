import React, { useEffect, useState } from "react";
import PieGraph from "../../graph/PieGraph";
import { Result, Question } from "../../../App";
import { SendMessage } from "react-use-websocket";

type Props = {
  question: Question;
  result: Result[];
  mobileView: boolean;
  clearResult: () => void;
  active: boolean;
  sendMessage: SendMessage;
};

export default function ResultView({
  mobileView,
  result,
  question,
  clearResult,
  active,
  sendMessage,
}: Props) {
  const [total, setTotal] = useState(0);

  useEffect(
    () => setTotal(result.reduce((acc, curr) => acc + curr.value, 0)),
    [result]
  );

  return (
    <div
      className="flex flex-col gap-8 tablet:w-screen mobile:w-screen laptop:w-1/2 p-2"
      // style={{ background: "#9AD0EC" }}
    >
      <div className="flex justify-between text-4xl font-bold">
        <div>On Going</div>
        {active ? (
          <div
            style={{ width: "40px", height: "40px" }}
            onClick={() =>
              sendMessage(JSON.stringify({ type: "stop", data: "" }))
            }
            className="text-black cursor-pointer hover:text-red-500"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="pause-circle"
              className="svg-inline--fa fa-pause-circle fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm96-280v160c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16zm-112 0v160c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16z"
              ></path>
            </svg>
          </div>
        ) : (
          <div
            style={{ width: "40px", height: "40px" }}
            className="text-black cursor-pointer hover:text-green-500"
            onClick={() =>
              sendMessage(JSON.stringify({ type: "start", data: "" }))
            }
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="play-circle"
              className="svg-inline--fa fa-play-circle fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M371.7 238l-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42zM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256z"
              ></path>
            </svg>
          </div>
        )}
        <div
          style={{ width: "30px", height: "30px" }}
          className="text-black hover:text-red-500 cursor-pointer"
          onClick={clearResult}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="trash-alt"
            className="svg-inline--fa fa-trash-alt fa-w-14"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
            />
          </svg>
        </div>
      </div>
      <div className="flex justify-center text-4xl w-100">
        <div
          style={{ background: "#FFF2F9", color: "#7A0BC0" }}
          className="p-4 rounded-lg text-center"
        >
          {question?.data}
        </div>
      </div>
      <div className="flex text-center justify-center">
        <PieGraph data={result} resize={mobileView ? false : true} />
      </div>
      <div className="flex text-center justify-center text-2xl">
        Total: {total}
      </div>
    </div>
  );
}
