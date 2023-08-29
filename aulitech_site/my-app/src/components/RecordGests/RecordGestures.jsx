import React, { useState, useRef } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { get, clear, set } from "idb-keyval";
import StoreGestData from "../CloudFirestore/StoreGestData";
import ProgBar from "./record/ProgBar";
import RcrdCard from "./record/RcrdCard";
import WriteAccess from "./record/WriteAccess";
import GestureData from "./record/GestureData";
import DoneCard from "./record/DoneCard";

const RecordGestures = ({
  classNames,
  gestName,
  user,
  handleDoneRecording,
}) => {
  const [stepCount, setStepCount] = useState(0);
  const [doneMsg, setDoneMsg] = useState(false);
  const [writeConnect, setWriteConnect] = useState(false);
  // const [checkConnect, setCheckConnect] = useState(false);
  const [startGest, setStartGest] = useState(false);
  const [timer, setTimer] = useState("00");
  const Ref = useRef(null);

  const handleStepCount = () => {
    if (stepCount <= 4) {
      setStepCount(stepCount + 1);
      setWriteConnect(false);
      // setCheckConnect(false);
    } else {
      setDoneMsg(true);
      setStepCount(0);
      // handleDoneRecording(true);
    }
  };

  const handleWriteAccess = () => {
    WriteAccess(setWriteConnect, setStartGest);
  };

  const handleGestureData = () => {
    GestureData(user, gestName, handleStepCount);
  };

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    return {
      total,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(seconds);
    }
  };

  const clearTimer = (e) => {
    setTimer("10");

    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    deadline.setSeconds(deadline.getSeconds() + 10);
    return deadline;
  };

  const onClickReset = () => {
    setTimeout(() => {}, 1000);
    setTimeout(() => {
      clearTimer(getDeadTime());
    }, 1000);
  };

  const HandleTimer = () => {
    let dataContents;

    const tryGetLog = async () => {
      try {
        const directory = await get("directory");

        if (typeof directory !== "undefined") {
          const perm = await directory.requestPermission();

          if (perm === "granted") {
            const catoFile = await directory.getFileHandle("cato.py", {
              create: false,
            });

            const dataFile = await catoFile.getFile();
            dataContents = await dataFile.text();
            console.log(dataContents);
            return dataContents;
          }
        }
      } catch (error) {
        console.log("get log.txt/ gesture data error:", error);
        setTimeout(tryGetLog, 100);
      }
    };
    tryGetLog();
    console.log(dataContents);

    if (dataContents !== undefined) {
      onClickReset();
    }
    return (
      <>
        {dataContents !== undefined ? (
          <h3 className="text-base font-semibold leading-6 text-blue-500">
            {timer}
          </h3>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 animate-spin"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        )}
      </>
    );
  };

  return (
    <>
      <div className="flex h-full">
        <div className="">
          <ProgBar
            classNames={classNames}
            stepCount={stepCount}
            gestName={gestName}
          />
        </div>
        <div className="flex-auto my-5">
          {doneMsg ? (
            <DoneCard gestName={gestName} handleDoneRecording={handleDoneRecording}/>
          ) : (
            <RcrdCard
              gestName={gestName}
              stepCount={stepCount}
              handleWriteAccess={handleWriteAccess}
              handleGestureData={handleGestureData}
              writeConnect={writeConnect}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RecordGestures;
