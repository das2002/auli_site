import React, { useState, useRef } from "react";
import { get, set } from 'idb-keyval';
import { styles } from "../components/RecordGests/ConfigureGestures";


const WriteCato = ({classNames, handleConfigSuccess}) => {
  const [configSuccess, setConfigSuccess]  = useState(false);
  const [timer, setTimer] = useState('00');
  const [startCountdown, setStartCountdown] = useState(false);
  const [performGest, setPerformGest] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const Ref = useRef(null);

  const writeConfig = async() => {
    try {
      const directory = await get('directory');
      console.log(directory);

      if(typeof directory !== 'undefined') {
        const perm = await directory.requestPermission()

        if(perm === 'granted') {
          const configFile = await directory.getFileHandle('gesture.cato', { create: true });
          
          console.log('gesture.cato: ', configFile);
          
          const writable = await configFile.createWritable();
          await writable.write(1);
          await writable.close();

          const checkConfig = await directory.getFileHandle('gesture.cato', { create: false })
          if(checkConfig !== null) {
            await set('checkConfig', checkConfig);
            console.log('stored gesture.cato handle: ', checkConfig.name);
            setConfigSuccess(true);
            handleConfigSuccess(true);
            onClickReset();
          };
        };
      }
    }
    catch(error) {
      console.log("write config.cato error:", error);
    }
  }

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
    setShowSpinner(true);
    setTimeout(() => {
      setShowSpinner(false)
    }, 18000);

    setTimeout(() => {
      clearTimer(getDeadTime());
      setPerformGest(false);
      setStartCountdown(true);
      setPerformGest(true)
    }, 18000);
  }

  return (
    <>
    <div className={classNames(configSuccess ? styles.ACTIVE_RING : "", "bg-white shadow sm:rounded-lg sm:mx-auto sm:w-full md:max-w-md")}>
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-base font-semibold leading-6 text-gray-900">3. Enter</h3>
      <div className="mt-2 sm:flex sm:items-start sm:justify-between">
        <div className="max-w-xl text-sm text-gray-500">
          <p>
            After you click Enter you will be prompted by your browser to be able to send commands to your Cato device.               
          </p>
          <p className="mt-2 text-blue-500">
            Click Enter, then 'View Files' and 'Save Changes'
          </p>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={writeConfig}
          className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Enter
        </button>
      </div>
    </div>
  </div>
  <br/>
  <div className={classNames(startCountdown ? styles.ACTIVE_RING : "", "bg-white shadow sm:rounded-lg sm:mx-auto sm:w-full md:max-w-md")}>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">4. Record Gesture</h3>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <p>
              When the timer appears below please perform your selected gesture with your Cato device attached to you at your preferred location.
            </p>
          </div>
        </div>
        {showSpinner ? 
          <div className="mt-2 sm:flex sm:items-start sm:justify-between">
            <div className="max-w-xl text-sm text-gray-500">
              <p>
                Connecting to Cato...
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
        :
        <h3 className="text-base font-semibold leading-6 text-blue-500">{startCountdown ? timer : null}</h3>
      }
        <div className="mt-2 max-w-xl text-sm text-gray-500">
        </div>
        
        <h3 className={classNames(performGest ? "text-blue-500" : "text-blue-200", "text-base font-semibold leading-6")}>
          {performGest ? 'Perform Gesture' : null}
        </h3>
      </div>
    </div>
  </>
  )

};

export default  WriteCato;