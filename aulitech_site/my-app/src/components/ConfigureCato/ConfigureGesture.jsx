import React, { useState } from "react";
import { clear } from 'idb-keyval';
import ConnectDirectory from "./ConnectDirectory";
//import FormatGestData from "../CloudFirestore/FormatGestData";
import SelectGesture from "./SelectGesture";
import WriteCato from "./WriteCato";
import GestureCountdown from "./GestureCountdown";
import GestureData from "./GestureData";

export const styles = {ACTIVE_RING : "ring-1 ring-blue-500"}

const ConfigureGesture = ({classNames}) => {
  const [catoConnected, setCatoConnected] = useState(false);
  const [gestID, setGestID] = useState(0);
  const [configSuccess, setConfigSuccess]  = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);

  const gestures = [
    {id: 0, name: 'Select'},
    {id: 1, name: 'Nod up'},
    {id: 2, name: 'Nod down'},
    {id: 3, name: 'Nod right'},
    {id: 4, name: 'Nod left'},
    {id: 5, name: 'Tilt right'},
    {id: 6, name: 'Tilt left'},
    {id: 7, name: 'Shake vertical'},
    {id: 8, name: 'Shake horizontal'},
    {id: 9, name: 'Circle clockwise'},
    {id: 10, name: 'Circle counterclockwise'}
  ];

  const handleCatoConnected = (connectState) => {
    setCatoConnected(connectState);
    console.log(catoConnected);
  }

  const handleGestID = (num) => {
    setGestID(num);
  }

  const handleStartCountdown = (startState) => {
    setStartCountdown(true);
  }

  const handleConfigSuccess = (writeState) => {
    setConfigSuccess(writeState);
    console.log(configSuccess);
  }

  const reset = () => {
    clear();
    setCatoConnected(false);
    setConfigSuccess(false);
  }

  return (
    <div  className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <ConnectDirectory classNames={classNames} reset={reset} handleCatoConnected={handleCatoConnected}/>
      <br/>
      <SelectGesture classNames={classNames} handleGestID={handleGestID}/>
      <br/>
      <WriteCato classNames={classNames} gestID={gestID} handleStartCountdown={handleStartCountdown} handleConfigSuccess={handleConfigSuccess}/>
      <br/>
      <GestureCountdown classNames={classNames} startCountdown={startCountdown}/>
      <br/>
      <GestureData classNames={classNames} gestures={gestures}/>
    </div>
  )
};

export default ConfigureGesture;