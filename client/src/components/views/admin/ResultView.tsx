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
      style={{ background: "#9AD0EC" }}
    >
      <div className="flex justify-between text-4xl font-bold">
        <div>On Going</div>
        {active ? (
          <div
            style={{ width: "30px", height: "30px" }}
            onClick={() =>
              sendMessage(JSON.stringify({ type: "stop", data: "" }))
            }
            className="text-black cursor-pointer hover:text-red-500"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="stop"
              className="svg-inline--fa fa-stop fa-w-14"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"
              ></path>
            </svg>
          </div>
        ) : (
          <div
            style={{ width: "30px", height: "30px" }}
            className="text-black cursor-pointer hover:text-green-500"
            onClick={() =>
              sendMessage(JSON.stringify({ type: "start", data: "" }))
            }
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="play"
              className="svg-inline--fa fa-play fa-w-14"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
              />
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
