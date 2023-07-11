import React, { useState, useRef, useEffect } from "react";

const GestureCountdown = ({classNames, startCountdown}) => {
  const [timer, setTimer] = useState('00');
  const [performGest, setPerformGest] = useState(false);

  const Ref = useRef(null);

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    return {
      total, seconds
    };
  }

  const startTimer = (e) => {
    let { total, seconds }
                = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (seconds > 5 ? seconds : '0' + seconds)
      )
    }
  }

  const clearTimer = (e) => { 
    setTimer('15');

    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000)
    Ref.current = id;
  }

  const getDeadTime = () => {
    let deadline = new Date();

    deadline.setSeconds(deadline.getSeconds() + 10);
    return deadline;
  }

  const onClickReset = () => {
    clearTimer(getDeadTime());
    setPerformGest(false);
  }

  useEffect(() => {
    const startListener = () => {
      if(startCountdown) {
        onClickReset()
      } else {
        return;
      }
    }
    return () => {
      startListener();
    }
  });

  return (
    <div className="bg-white shadow sm:rounded-lg sm:mx-auto sm:w-full md:max-w-md">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-blue-500">{timer}</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
        </div>
        <h3 className={classNames(performGest ? "text-blue-500" : "text-blue-200", "text-base font-semibold leading-6")}>
          Perform Gesture
        </h3>
      </div>
    </div>
)

};

export default GestureCountdown;