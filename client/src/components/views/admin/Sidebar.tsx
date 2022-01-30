import React from "react";
import { motion } from "framer-motion";
import { Question } from "../../../App";

type Props = {
  isOpen: boolean;
  questions: Question[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sendQuestion: (question: Question) => void;
};

export default function Sidebar({
  isOpen,
  sendQuestion,
  setIsOpen,
  questions,
}: Props) {
  return (
    <motion.div
      className={`flex overflow-y-auto sticky top-0 z-20`}
      style={{ background: "#323232", minWidth: isOpen ? 400 : 55 }}
      animate={{
        width: isOpen ? "400px" : "55px",
      }}
    >
      <motion.div
        className="cursor-pointer text-white hover:text-lime-300 relative z-30"
        animate={{
          x: isOpen ? 350 : 0,
          rotate: isOpen ? 180 : 0,
        }}
        style={{ width: 50, height: 50 }}
      >
        <svg
          width={50}
          height={50}
          aria-hidden="true"
          focusable="false"
          data-prefix="fad"
          data-icon="angle-double-right"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="svg-inline--fa fa-angle-double-right fa-w-14 fa-5x"
          onClick={() => setIsOpen(() => !isOpen)}
        >
          <g className="fa-group">
            <path
              fill="currentColor"
              d="M224 273L88.37 409a23.78 23.78 0 0 1-33.8 0L32 386.36a23.94 23.94 0 0 1 0-33.89l96.13-96.37L32 159.73a23.94 23.94 0 0 1 0-33.89l22.44-22.79a23.78 23.78 0 0 1 33.8 0L223.88 239a23.94 23.94 0 0 1 .1 34z"
              className="fa-secondary"
            ></path>
            <path
              fill="currentColor"
              d="M415.89 273L280.34 409a23.77 23.77 0 0 1-33.79 0L224 386.26a23.94 23.94 0 0 1 0-33.89L320.11 256l-96-96.47a23.94 23.94 0 0 1 0-33.89l22.52-22.59a23.77 23.77 0 0 1 33.79 0L416 239a24 24 0 0 1-.11 34z"
              className="fa-primary"
            ></path>
          </g>
        </svg>
      </motion.div>
      <div className="mt-16 text-white text-2xl flex flex-col gap-2">
        {isOpen &&
          questions.map((e, i) => (
            <div key={i} className="flex gap-2">
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginLeft: "-40px", marginRight: "5px" }}
                className="p-4 border-2 w-80 cursor-pointer hover:text-yellow-400 overflow-hidden text-ellipsis whitespace-nowrap rounded-md"
              >
                {e.data}
              </motion.div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => sendQuestion(e)}
              >
                <div
                  style={{ width: "50px", height: "50px" }}
                  className="text-white hover:text-yellow-200"
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
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
      </div>
    </motion.div>
  );
}
