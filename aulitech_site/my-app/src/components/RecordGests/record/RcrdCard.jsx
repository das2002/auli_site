import React, { useState, useRef } from "react";
import DirAccess from "./DirAccess";
import WriteAccess from "./WriteAccess";
import GestureData from "./GestureData";

export default function RcrdCard({
  user,
  gestName,
  stepCount,
  handleStepCount,
  writeConnect,
  setWriteConnect,
  dataRetrieved,
  setDataRetrieved,
  handleDoneRecording
}) {
  const [start, setStart] = useState(null);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [gotData, setGotData] = useState(false);
  const [startGest, setStartGest] = useState(false);
  const [timer, setTimer] = useState("00");
  const Ref = useRef(null);

  const ConnectDirAlert = () => {
    return (
      <div className="rounded-md w-full bg-blue-50 p-4">
        <div className="flex items-center">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-500">
              Connect to Cato
            </h3>
            <div className="text-sm text-blue-500">
              <p>
                <br />
                When you click <strong>Connect Cato</strong> you will be
                prompted by your broswer to select a directory.
              </p>
              <br />
              <p>
                Select the <strong>AULI_CATO</strong> directory from the finder
                window.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StartInfoAlert = () => {
    return (
      <div className="rounded-md w-full bg-blue-50 p-4">
        <div className="flex items-center">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-500">
              Enable Recording on Cato
            </h3>
            <div className="text-sm text-blue-500">
              <p>
                <br />
                When you click Start,you will be prompted by your browser,
                select <strong>View Files</strong>, then select{" "}
                <strong>Save Changes</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NextInfoAlert = () => {
    return (
      <div className="rounded-md w-full bg-blue-50 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-500">Enable Database Access to Cato</h3>
            <div className="text-sm text-blue-500">
              <p>
                When you click <strong>Next</strong>, a new prompt from your broswer will appear.
                Select <strong>INSTERT TEXT</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ErrorAlert = () => {
    return (
      <div className="rounded-md w-full bg-amber-50 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-yellow-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-500">Attention</h3>
            <div className="text-sm text-yellow-500">
              <p>
                {errMsg}
                <br/>
                There has been an error. Please review the Cato docs for help troubleshooting the issue.
              </p>
              <a href="https://github.com/aulitech/Cato/wiki" className="underline-offset-2">Cato Wiki</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

// --------------------------------------------------------------------------------------------------------------------------------------------------

  const handleDirAccess = () => {
    DirAccess();
    setStart(true);
  };

  const handleWriteAccess = () => {
    WriteAccess(handleWriteConnect);
  };

  const handleGestureData = () => {
    GestureData(user, gestName, handleStepCount, handleGotData, handleSetErr);
  };

// --------------------------------------------------------------------------------------------------------------------------------------------------

  const handleStart = () => {
    try {
      handleWriteAccess();
      setStart(false);
    } catch (err) {
      console.log("handle start btn err: ", err);
    }
  };

  const handleNext = () => {
    try {
      handleGestureData();
      setStart(true);
    } catch (err) {
      console.log("handle next btn err: ", err);
    }
  };

  const handleSetErr = (err) => {
    console.log(err);
    setError(true);
    setErrMsg(`${err.message}`);
  }

  const handleGotData = (dataStatus) => {
    setGotData(dataStatus);
  }

  const handleWriteConnect = (connectStatus) => {
    setWriteConnect(connectStatus);
  }

// --------------------------------------------------------------------------------------------------------------------------------------------------

  const HandleInfoAlert = () => {
    let alert;
    if (start === null) {
      alert = <ConnectDirAlert />;
    } else if (error) {
      alert = <ErrorAlert />;
    } else if (start) {
      alert = <StartInfoAlert />;
    } else if (writeConnect) {
      alert = <NextInfoAlert />;
    }
    return <div className="mt-5 flex items-center justify-end">{alert}</div>;
  };

  const HandleButton = () => {
    let click;
    let btnTxt;
    if (start === null) {
      click = handleDirAccess;
      btnTxt = "Connect Cato";
    } else if (error) {
      click = handleDoneRecording;
      btnTxt = "Record Gestures Homepage"
    } else if (start) {
      click = handleStart;
      btnTxt = "Start Recording";
    } else if (writeConnect) {
      click = handleNext;
      btnTxt = "Next";
    }
    return (
      <div className="flex justify-center mt-10">
        <button
          type="button"
          onClick={click}
          className="inline-flex rounded-full items-center bg-blue-500 px-2.5 py-1 text-lg font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-300"
        >
          {btnTxt}
        </button>
      </div>
    );
  };

  // --------------------------------------------------------------------------------------------------------------------------------------------------

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

  // --------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-5 h-full">
      <div className="px-4 py-5 sm:p-6 lg:px-8">
        <div className="border-b border-gray-200 pb-10">
          <div className="border-b border-gray-200 pb-5 flex justify-between">
            <h3 className="text-xl font-semibold leading-6 text-gray-900 flex-none">
              Recording {stepCount + 1}:
            </h3>
          </div>
          {stepCount === 0 ? <HandleInfoAlert /> : null}
        </div>
        <HandleButton />
        {/* <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={start ? handleStart : handleNext}
              className="inline-flex rounded-full items-center bg-blue-500 px-2.5 py-1 text-lg font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-300"
            >
              {start ? "Start" : "Next"}
            </button>
          </div> */}
      </div>
    </div>
  );
}
