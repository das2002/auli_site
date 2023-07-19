import React, { useState } from "react";
import { clear } from 'idb-keyval';
// import ConnectDirectory from "../Dashboard/device-connection/ConnectDirectory";
//import FormatGestData from "../CloudFirestore/FormatGestData";
// import SelectGesture from "./SelectGesture";
// import WriteCato from "./WriteCato";
// import GestureData from "./GestureData";
// import Example from "./RecordGstr";
import RecordGstr from "./RecordGstr";


const ConfigureGesture = ({classNames, user}) => {
  // const [catoConnected, setCatoConnected] = useState(false);
  // const [gestName, setGestName] = useState('');
  // const [configSuccess, setConfigSuccess]  = useState(false);
  // const [startCountdown, setStartCountdown] = useState(false);

  // const gestures = [
  //   {id: 0, name: 'Select'},
  //   {id: 1, name: 'Nod up'},
  //   {id: 2, name: 'Nod down'},
  //   {id: 3, name: 'Nod right'},
  //   {id: 4, name: 'Nod left'},
  //   {id: 5, name: 'Tilt right'},
  //   {id: 6, name: 'Tilt left'},
  //   {id: 7, name: 'Shake vertical'},
  //   {id: 8, name: 'Shake horizontal'},
  //   {id: 9, name: 'Circle clockwise'},
  //   {id: 10, name: 'Circle counterclockwise'}
  // ];

  // const handleCatoConnected = (connectState) => {
  //   setCatoConnected(connectState);
  //   console.log(catoConnected);
  // }

  // const handleGestName = (name) => {
  //   setGestName(name);
  // }

  // const handleStartCountdown = (startState) => {
  //   setStartCountdown(startState);
  //   console.log(startCountdown);
  // }

  // const handleConfigSuccess = (writeState) => {
  //   setConfigSuccess(writeState);
  //   console.log(configSuccess);
  // }

  // const reset = () => {
  //   clear();
  //   setCatoConnected(false);
  //   setConfigSuccess(false);
  // }

  return (
    <div>
      <RecordGstr classNames={classNames}/>
    </div>
  )
};

export default ConfigureGesture;