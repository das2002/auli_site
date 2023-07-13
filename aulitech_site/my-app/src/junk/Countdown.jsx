import React, { useState, useRef, useEffect } from 'react';

const CountDown = ({startCountdown, countDownClass}) => {
  const [timer, setTimer] = useState('00');

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
      setTimer('10');

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
  }

  useEffect(() => {
      if (startCountdown) {
      clearTimer(getDeadTime());
      };
  });

  return (
      <>
        <h3 className={countDownClass}>{timer}</h3>
      </>
  )
}

export default CountDown;