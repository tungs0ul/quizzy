import React, { useCallback, Suspense } from "react";
import { SendMessage } from "react-use-websocket";
import { COLORS } from "../../utils";
import { motion } from "framer-motion";
import { Question, Result } from "../../App";

const PieGraph = React.lazy(() => import("../graph/PieGraph"));

type Props = {
  answer: number | null;
  setAnswer: any;
  sendMessage: SendMessage;
  question: Question;
  result: Result[];
  notice: string;
  active: boolean;
};

export default function StudentView({
  answer,
  setAnswer,
  sendMessage,
  question,
  result,
  notice,
  active,
}: Props) {
  const submitAnswer = useCallback(
    (index: number) => {
      sendMessage(
        JSON.stringify({ type: "answer", data: JSON.stringify(index) })
      );
      setAnswer(index);
    },
    [answer]
  );

  return (
    <div>
      {notice && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 20 }}
          transition={{ duration: 0.5 }}
          className="fixed right-5 top-0 bg-gray-200 h-14 flex items-center text-center z-50"
        >
          <div className="p-2 text-2xl">{notice}</div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
            className="bg-blue-600 w-full absolute bottom-0 h-2"
          ></motion.div>
        </motion.div>
      )}
      {answer === null && active ? (
        <div className="relative">
          {question && (
            <>
              <div className="flex justify-center text-4xl p-4 tablet:pt-12 tablet:pb-12 mobile:pt-4 mobile:pb-8 mobile:mb-8 tablet:mb-1 relative bubble">
                <p className="thought">{question.data}</p>
              </div>
              <div className="gap-4 flex flex-col mobile:flex-col laptop:flex-row justify-center tablet:flex-wrap p-8 options">
                {question?.options &&
                  question.options.map((option: string, index: number) => (
                    <div
                      className="flex justify-center"
                      key={`${option}-${index}`}
                    >
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          width: "100%",
                        }}
                        transition={{ duration: index * 0.5 + 0.5 }}
                        onClick={() => submitAnswer(index)}
                        className="border-2 border-black mobile:p-4 tablet:p-12 mobile:w-full flex justify-center rounded-md mobile:text-3xl tablet:text-4xl cursor-pointer option"
                      >
                        {option}
                      </motion.span>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-center text-4xl p-4 tablet:pt-12 tablet:pb-12 mobile:pt-4 mobile:pb-8 mobile:mb-8 tablet:mb-1 relative bubble">
            <p className="thought">{question?.data?.length && question.data}</p>
          </div>
          {answer !== null && (
            <div className="flex justify-center text-center text-2xl">
              Your answer is:{" "}
              <span className="ml-2" style={{ color: COLORS[answer] }}>
                {question?.options[answer]}
              </span>
            </div>
          )}
          <Suspense fallback={<div>Loading...</div>}>
            <PieGraph data={result} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
