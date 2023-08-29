import React, { useState, useRef} from "react";

export default function RcrdCard({
  gestName,
  stepCount,
  handleWriteAccess,
  handleGestureData,
  writeConnect
}) {
  const [start, setStart] = useState(true);
  const [timer, setTimer] = useState("00");
  const Ref = useRef(null);

  const StartInfoAlert = () => {
    return (
      <div className="rounded-md bg-blue-50 p-4">
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
            {/* <h3 className="text-sm font-medium text-blue-500">Attention</h3> */}
            <div className="text-sm text-blue-500">
              <p>
                INSERT CONNECT TO DIRECTORY AND ALLOW WRITE ACCESS TEXT
                {/* When you click Start, prompts from your broswer will appear. <br/><br/>You will be prompted by your browser to select a directory, select <strong>AULI_CATO</strong>, then
                select <strong>Save Changes</strong>. */}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NextInfoAlert = () => {
    return (
      <div className="rounded-md bg-blue-50 p-4">
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
            {/* <h3 className="text-sm font-medium text-blue-500">Attention</h3> */}
            <div className="text-sm text-blue-500">
              <p>
                When you click Next, a new prompt from your broswer will appear.
                Select <strong>INSTERT TEXT</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

// --------------------------------------------------------------------------------------------------------------------------------------------------

  const handleStart = async() => {
    try {
      handleWriteAccess();

      if (writeConnect) {
        setStart(false);
      }
    }
    catch(err) {
      console.log('handle start btn err: ', err);
    }
  };

  const handleNext = () => {
    handleGestureData();
    setStart(true);
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
              <div className="ml-5 flex items-center justify-end">
              {stepCount === 0 ? start ? <StartInfoAlert /> : <NextInfoAlert/> : null}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={start ? handleStart : handleNext}
              className="inline-flex rounded-full items-center bg-blue-500 px-2.5 py-1 text-lg font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-300"
            >
              {start ? "Start" : "Next"}
            </button>
          </div>
        </div>
      </div>
  );
}
