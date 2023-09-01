import React, { useState, useRef } from "react";
import ProgBar from "./record/ProgBar";
import RcrdCard from "./record/RcrdCard";


const RecordGestures = ({
  classNames,
  gestName,
  user,
  handleDoneRecording,
  handleDoneMsg
}) => {
  const [stepCount, setStepCount] = useState(0);
  const [writeConnect, setWriteConnect] = useState(false);
  const [dataRetrieved, setDataRetrieved] = useState(false);

  const handleStepCount = () => {
    if (stepCount >= 4) {
      handleDoneMsg();
      setStepCount(0);
    } else {
      setStepCount(stepCount + 1);
      setWriteConnect(false);
      // setCheckConnect(false);
    }
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
            <RcrdCard
              user={user}
              gestName={gestName}
              stepCount={stepCount}
              handleStepCount={handleStepCount}
              writeConnect={writeConnect}
              setWriteConnect={setWriteConnect}
              dataRetrieved={dataRetrieved}
              setDataRetrieved={setDataRetrieved}
              handleDoneRecording={handleDoneRecording}
            />
        </div>
      </div>
    </>
  );
};

export default RecordGestures;
