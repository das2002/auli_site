import React, { useState } from "react";
import { clear } from "idb-keyval";
import ConnectDirectory from "./ConnectDirectory";
//import FormatGestData from "../CloudFirestore/FormatGestData";
import SelectGesture from "./SelectGesture";
import ConnectWrt from "../../junk/ConnectWrt";
// import GestureCountdown from "./GestureCountdown";
import ConnectLog from "../../junk/ConnectLog";
import ConnectDevice from "./ConnectDevice";
import RecordGestures from "./RecordGestures";

export const styles = { ACTIVE_RING: "ring-1 ring-blue-500" };

const ConfigureGestures = ({ classNames, user }) => {
  const [catoConnected, setCatoConnected] = useState(false);
  const [gestName, setGestName] = useState("");
  // const [configSuccess, setConfigSuccess] = useState(false);
  const [goToRecord, setGoToRecord] = useState(false);

  const handleCatoConnected = (connectState) => {
    setCatoConnected(connectState);
    console.log(catoConnected);
  };

  const handleGestName = (name) => {
    setGestName(name);
  };

  // const handleConfigSuccess = (writeState) => {
  //   setConfigSuccess(writeState);
  //   console.log(configSuccess);
  // };

  const reset = () => {
    clear();
    setCatoConnected(false);
    // setConfigSuccess(false);
  };

  const goToRecordPage = () => {
    setGoToRecord(true);
  };

  const handleDoneRecording = (recordState) => {
    setGoToRecord(recordState);
  };

  return (
    <div className="flex min-h-full flex-col">
      <header className="shrink-0 bg-transparent">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Record Gestures
          </h2>
        </div>
      </header>

      {/* column wrapper*/}
      <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2 h-full mt-5">
        <div className="shrink-0 border-gray-200 px-4 flex-initial py-6 sm:px-6 lg:w-72 lg:border-r lg:border-t-0 lg:pr-8 xl:pr-6">
          <ConnectDevice classNames={classNames} />
        </div>
        {/* Left sidebar & main wrapper */}

        <div className="flex-1 mr-5">
          <div className="border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:border-b-0 xl:border-r xl:pl-6">
            {/* Left column area */}
            {goToRecord ? (
              <RecordGestures
                gestName={gestName}
                user={user}
                classNames={classNames}
                handleDoneRecording={handleDoneRecording}
              />
            ) : (
              <div>
                <SelectGesture
                  classNames={classNames}
                  handleGestName={handleGestName}
                />
                <div className="border-b border-gray-200 pb-5">
                  <button
                    type="button"
                    disabled={gestName === ""}
                    onClick={goToRecordPage}
                    className={classNames(
                      gestName === ""
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-900 hover:bg-blue-500",
                      " focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                      "mt-10 inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold text-white shadow-sm"
                    )}
                  >
                    Select
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <header className="shrink-0 bg-transparent">
  //       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
  //         <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
  //           Record Gestures
  //         </h2>
  //       </div>
  //     </header>
  //     <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
  //       <ConnectDirectory
  //         classNames={classNames}
  //         reset={reset}
  //         handleCatoConnected={handleCatoConnected}
  //       />
  //       <br />
  //       <SelectGesture
  //         classNames={classNames}
  //         handleGestName={handleGestName}
  //       />
  //       <br />
  //       <WriteCato
  //         classNames={classNames}
  //         handleConfigSuccess={handleConfigSuccess}
  //       />
  //       <br />
  //       <GestureData classNames={classNames} gestName={gestName} user={user} />
  //     </div>
  //   </div>
  // );
};

export default ConfigureGestures;
