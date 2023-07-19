import React, { useState } from "react";
import { clear } from "idb-keyval";
import ConnectDirectory from "./ConnectDirectory";
//import FormatGestData from "../CloudFirestore/FormatGestData";
import SelectGesture from "./SelectGesture";
import WriteCato from "./WriteCato";
// import GestureCountdown from "./GestureCountdown";
import GestureData from "./GestureData";

export const styles = { ACTIVE_RING: "ring-1 ring-blue-500" };

const ConfigureGesture = ({ classNames, user }) => {
  const [catoConnected, setCatoConnected] = useState(false);
  const [gestName, setGestName] = useState("");
  const [configSuccess, setConfigSuccess] = useState(false);

  const handleCatoConnected = (connectState) => {
    setCatoConnected(connectState);
    console.log(catoConnected);
  };

  const handleGestName = (name) => {
    setGestName(name);
  };


  const handleConfigSuccess = (writeState) => {
    setConfigSuccess(writeState);
    console.log(configSuccess);
  };

  const reset = () => {
    clear();
    setCatoConnected(false);
    setConfigSuccess(false);
  };

  return (
    <div>
      <header className="shrink-0 bg-transparent">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Record Gestures
          </h2>
        </div>
      </header>
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <ConnectDirectory
          classNames={classNames}
          reset={reset}
          handleCatoConnected={handleCatoConnected}
        />
        <br />
        <SelectGesture
          classNames={classNames}
          handleGestName={handleGestName}
        />
        <br />
        <WriteCato
          classNames={classNames}
          handleConfigSuccess={handleConfigSuccess}
        />
        <br />
        <GestureData classNames={classNames} gestName={gestName} user={user} />
      </div>
    </div>
  );
};

export default ConfigureGesture;
