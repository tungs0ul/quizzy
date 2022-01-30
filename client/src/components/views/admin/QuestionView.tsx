import React, { useState, useRef } from "react";
import { Question } from "../../../App";
import { motion } from "framer-motion";

type Props = {
  addQuestions: (questions: Question[]) => void;
  sendQuestion: (question: Question) => void;
};

export default function QuestionView({ addQuestions, sendQuestion }: Props) {
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [question, setQuestion] = useState<Question>({
    type: "question",
    data: "",
    options: ["", ""],
  });

  const logFile = (event: any) => {
    let str = event.target.result;
    let json = JSON.parse(str);
    addQuestions(json);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files?.length) {
      return;
    }
    let reader = new FileReader();
    reader.onload = logFile;
    reader.readAsText(e.target.files[0]);
  };

  return (
    <div className="flex flex-col gap-8 tablet:w-screen mobile:w-screen laptop:w-1/2 p-2">
      <div className="flex justify-center">
        <div
          style={{ width: "40px", height: "40px" }}
          className="cursor-pointer text-black hover:text-orange-700"
          onClick={() => inputRef.current?.click()}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="upload"
            className="svg-inline--fa fa-upload fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
            />
          </svg>
          <input
            ref={inputRef}
            type="file"
            accept=".json"
            hidden
            onChange={handleFileInput}
          />
        </div>
      </div>
      <div className="flex justify-center text-2xl">ADD QUESTION</div>
      <div className="flex pr-8">
        <div className="w-1/3 text-2xl items-center justify-center flex">
          Question:
        </div>
        <textarea
          rows={5}
          className="border-2 rounded-md w-full text-2xl p-4"
          value={question.data}
          onChange={(e) => {
            let newQuestion = { ...question };
            newQuestion.data = e.target.value;
            setQuestion(newQuestion);
          }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-1/3 h-16 text-2xl items-center flex">Options:</div>
        {question.options.map((e, i) => (
          <div className="flex" key={i}>
            <motion.input
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              className="border-2 rounded-md w-full h-16 text-2xl pl-4 pr-4"
              value={e}
              onChange={(e) => {
                let newQuestion = { ...question };
                newQuestion.options[i] = e.target.value;
                setQuestion(newQuestion);
              }}
            />
            <div
              style={{ width: "40px" }}
              className="items-center flex ml-4 text-black hover:text-red-400 cursor-pointer"
              onClick={() => {
                let newQuestion = { ...question };
                newQuestion.options.splice(i, 1);
                setQuestion(newQuestion);
              }}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="minus-circle"
                className="svg-inline--fa fa-minus-circle fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"
                ></path>
              </svg>
            </div>
          </div>
        ))}
        <div className="flex justify-center text-black hover:text-blue-400 cursor-pointer">
          <div style={{ width: "40px", height: "40px" }}>
            <svg
              onClick={() => {
                setQuestion({
                  ...question,
                  options: [...question.options, ""],
                });
              }}
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="plus-circle"
              className="svg-inline--fa fa-plus-circle fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div
          className="text-3xl border-4 border-black p-8 rounded-lg text-white font-bold cursor-pointer hover:bg-neutral-800 bg-red-800"
          onClick={() => {
            let q = { ...question };
            q.options = q.options.filter((e) => e);
            if (q.options.length < 2) {
              alert("Please add atleast two options");
              return;
            }
            sendQuestion(q);
          }}
        >
          START QUESTION
        </div>
      </div>
    </div>
  );
}
