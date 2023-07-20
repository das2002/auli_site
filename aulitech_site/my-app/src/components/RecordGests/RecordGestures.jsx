import React, { useState, useRef } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { get, clear, set } from "idb-keyval";
import StoreGestData from "../CloudFirestore/StoreGestData";

const RecordGestures = ({
  classNames,
  gestName,
  user,
  handleDoneRecording,
}) => {
  const [stepCount, setStepCount] = useState(0);
  const [doneMsg, setDoneMsg] = useState(false);
  const [writeConnect, setWriteConnect] = useState(false);
  const [checkConnect, setCheckConnect] = useState(false);
  const [gestData, setGestData] = useState(null);
  const [startGest, setStartGest] = useState(false);
  const [timer, setTimer] = useState("00");
  const Ref = useRef(null);

  const ProgBar = () => {
    const steps = [
      {
        name: "Step 1",
        href: "#",
        status: stepCount >= 1 ? "complete" : "current",
      },
      {
        name: "Step 2",
        href: "#",
        status:
          stepCount === 1
            ? "current"
            : stepCount >= 1
            ? "complete"
            : "upcoming",
      },
      {
        name: "Step 3",
        href: "#",
        status:
          stepCount === 2
            ? "current"
            : stepCount >= 2
            ? "complete"
            : "upcoming",
      },
      {
        name: "Step 4",
        href: "#",
        status:
          stepCount === 3
            ? "current"
            : stepCount >= 3
            ? "complete"
            : "upcoming",
      },
      {
        name: "Step 5",
        href: "#",
        status:
          stepCount === 4
            ? "current"
            : stepCount >= 4
            ? "complete"
            : "upcoming",
      },
    ];

    return (
      <>
        <nav aria-label="Progress">
          <ol role="list" className="flex justify-center">
            {steps.map((step, stepIdx) => (
              <li
                key={step.name}
                className={classNames(
                  stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
                  "relative"
                )}
              >
                {step.status === "complete" ? (
                  <>
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="h-0.5 w-full bg-blue-500" />
                    </div>
                    <a
                      href="#"
                      className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-500"
                    >
                      <CheckIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{step.name}</span>
                    </a>
                  </>
                ) : step.status === "current" ? (
                  <>
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <a
                      href="#"
                      className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500 bg-white"
                      aria-current="step"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full bg-blue-500"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{step.name}</span>
                    </a>
                  </>
                ) : (
                  <>
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <a
                      href="#"
                      className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{step.name}</span>
                    </a>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </>
    );
  };

  const handleStepCount = () => {
    if (stepCount <= 4) {
      setStepCount(stepCount + 1);
      setWriteConnect(false);
      setCheckConnect(false);
      setGestData(null);
    } else {
      setDoneMsg(true);
      setStepCount(0);
      handleDoneRecording(true);
    }
  };

  const getGestureData = async () => {
    try {
      const directory = await get("directory");
      console.log(directory);

      if (typeof directory !== "undefined") {
        const perm = await directory.requestPermission();

        if (perm === "granted") {
          const logFile = await directory.getFileHandle("log.txt", {
            create: false,
          });

          const dataFile = await logFile.getFile();
          console.log(dataFile);
          const dataContents = await dataFile.text();
          console.log(dataContents);

          handleStepCount();
          StoreGestData(gestName, user, dataContents);
        }
      }
    } catch (error) {
      console.log("get log.txt/ gesture data error:", error);
    }
  };

  const getWriteAccess = async () => {
    try {
      const directory = await get("directory");
      console.log("retrieved dir handle:", directory);

      if (typeof directory !== "undefined") {
        const perm = await directory.requestPermission();

        if (perm === "granted") {
          const writeHandleOrUndefined = await get("gesture.cato");

          if (writeHandleOrUndefined) {
            console.log("retrieved file handle:", writeHandleOrUndefined.name);
            setWriteConnect(true);
          }

          const writeFile = await directory.getFileHandle("gesture.cato", {
            create: true,
          });

          console.log(writeFile);
          
          const writable = await writeFile.createWritable();
          await writable.write(1);
          await writable.close();

          await set("gesture.cato", writeFile);
          console.log("stored file handle:", writeFile.name);
          setWriteConnect(true);
          setStartGest(true);
          const checkConfig = await directory.getFileHandle("gesture.cato", {
            create: false,
          });
          if (checkConfig !== null) {
            await set("checkConfig", checkConfig);
            console.log("stored gesture.cato handle: ", checkConfig.name);
            setCheckConnect(true);
          }
        }
      }
    } catch (error) {
      console.log("write config.cato error:", error);
    }
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
            const logFile = await directory.getFileHandle("log.txt", {
              create: false,
            });

            const dataFile = await logFile.getFile();
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
      <div>
        <ProgBar />
        <div className="bg-white shadow sm:rounded-lg mt-2.5">
          <div className="px-4 py-5 sm:p-6 ">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {gestName} Recording {stepCount + 1}
            </h3>
            <div className="mt-2 sm:flex sm:items-start sm:justify-between">

            <div className="mt-2 max-w-xl text-sm text-gray-500">
              {stepCount === 0 ? (
                <p className="text-sm leading-6 text-blue-500">
                  When you click Start, a prompt from your broswer will appear.
                  Select 'Save changes.'
                </p>
              ) : null}

              <p className="m-5">Click start to begin.</p>
            </div>
            <div className="m-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
              <button
                type="button"
                onClick={getWriteAccess}
                className="inline-flex items-center rounded-full bg-blue-500 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                Start
              </button>
            </div>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
          <button
            type="button"
            onClick={getGestureData}
            className="mt-3 rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Next
          </button>
        </div>  
      </div>
    </>
  );
};

export default RecordGestures;
