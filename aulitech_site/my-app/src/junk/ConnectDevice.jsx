import React, {useState, useEffect} from "react";
import { get, clear, set } from 'idb-keyval';
// import ConnectDir from "./ConnectDir";
import ConnectWrt from "./ConnectWrt";
import ConnectLog from "./ConnectLog";

const ConnectDevice = ({classNames}) => {
  const [dirConnect, setDirConnect] = useState(null);
  const [writeConnect, setWriteConnect] = useState(false);
  const [checkConnect, setCheckConnect] = useState(false);
  const [logConnect, setLogConnect] = useState(false);
  const [logErr, setLogErr] = useState('');

  const reset = () => {
    clear();
    setDirConnect(false);
    setWriteConnect(false);
    setCheckConnect(false);
    setLogConnect(false)
    setLogErr('');
  }

  useEffect(() => {
    let dir = false;
    let write = false;
    let check = false;
    let log = false;

    const checkConnection = async() => {
      let dirHandle = await get('directory');
      let writeHandle = await get('gesture.cato');
      let checkWrtHandle = await get('checkConfig');
      let logHandle = await get('log.txt');

      if (dirHandle === undefined) {
        dir = false;
      } else {
        dir = true;
      }
      if (writeHandle === undefined) {
        write = false;
      } else {
        write = true;
      }
      if (checkWrtHandle === undefined) {
        check = false;
      } else {
        check = true;
      }
      if (logHandle === undefined) {
        log = false;
      } else {
        log = true;
      }
      return (dir, write, check, log);
    }

    return () => {
      checkConnection();
      setDirConnect(dir);
      setWriteConnect(write);
      setCheckConnect(check);
      setLogConnect(log)
    }
  }, [])

/* -------------------------------------------------------------------------------------------------------- */

  const getDirectory = async() => {
    try {
      const dirHandleOrUndefined = await get('directory');

      if (dirHandleOrUndefined) {
        console.log("retrieved dir handle:", dirHandleOrUndefined.name);
        setDirConnect(true);
        return;
      }

      const dirHandle = await window.showDirectoryPicker({
        id: 'AULI_CATO',
        mode: 'readwrite'
      });

      await set('directory', dirHandle);
      console.log('store dir handle:', dirHandle.name);
      setDirConnect(true);
      
    }
    catch(error) {
      console.log("get directory error:", error);
    }
  }

  const HandleConnectedDirUI = () => {
    if(get('directory') === null || !dirConnect) {
      return(
        <>
          <div className="px-4 py-5 sm:p-4">
            {/* <h3 className="text-base font-semibold leading-6 text-gray-900">Connect AULI_CATO</h3> */}
            {/* <div className="max-w-xl text-sm text-gray-500">
              <p>Click Connect, you will be prompted by your browser to select a directory, select AULI_CATO.</p>
            </div> */}
            <button
              type="button"
              onClick={getDirectory}
              className="mt-2 inline-flex items-center rounded-full bg-blue-500 px-2.5 py-1 text-base font-semibold text-white shadow-sm hover:bg-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              Connect Cato
            </button>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="px-4 py-4 sm:p-4">
            <div className="sm:flex sm:items-start sm:justify-between">
              <h3 className="text-sm font-semibold leading-6 text-blue-500">AULI_CATO Access Granted</h3>
              <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>
          </div>
        </>
      )
    }
  }

/* -------------------------------------------------------------------------------------------------------- */

  const getWriteAccess = async() => {
    try {
      const directory = await get('directory');
      console.log("retrieved dir handle:", directory);

      if(typeof directory !== 'undefined') {
        const perm = await directory.requestPermission()

        if(perm === 'granted') {
          const writeHandleOrUndefined = await get('gesturecato');

          if (writeHandleOrUndefined) {
            console.log("retrieved file handle:", writeHandleOrUndefined.name);
            setWriteConnect(true);
            return;
          }

          const writeFile = await directory.getFileHandle('gesture.cato');

          await set('gesturecato', writeFile);
          console.log('stored file handle:', writeFile.name);
          setWriteConnect(true);
          const checkConfig = await directory.getFileHandle('gesture.cato', { create: false })
          if(checkConfig !== null) {
            await set('checkConfig', checkConfig);
            console.log('stored gesture.cato handle: ', checkConfig.name);
          };
        };
      }
    }
    catch(error) {
      console.log("write config.cato error:", error);
    }
  }

  const HandleConnectedWriteUI = () => {
    if(get('gesture.cato') === null || !writeConnect) {
      return(
        <>
          <div className="px-4 py-5 sm:p-4">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Connect Record</h3>
            {/* <div className=" max-w-xl text-sm text-gray-500">
              <p>Click Connect, you will be prompted by your browser to select a directory, select AULI_CATO.</p>
            </div> */}
            <button
              type="button"
              onClick={getWriteAccess}
              className="mt-2 inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              Connect
            </button>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="px-4 py-5 sm:p-4">
            <div className="sm:flex sm:items-start sm:justify-between">
              <h3 className="text-sm font-semibold leading-6 text-blue-500">Cato Command Access Granted</h3>
              <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>
          </div>
        </>
      )
    }
  }

  /* -------------------------------------------------------------------------------------------------------- */

  const getGestDataAccess = async() => {
    try {
      const directory = await get('directory');
      console.log("retrieved dir handle:", directory);

      if(typeof directory !== 'undefined') {
        const perm = await directory.requestPermission()

        if(perm === 'granted') {
          const logHandleOrUndefined = await get('log');

          if (logHandleOrUndefined) {
            console.log("retrieved file handle:", logHandleOrUndefined.name);
            setLogConnect(true);
            return;
          }
          const logFile = await directory.getFileHandle('log.txt', { create: false });

          await set('log', logFile);
          console.log('stored file handle:', logFile.name);

          setLogConnect(true);
          // setLogErr('')
        }
      }
    }
    catch(error) {
      console.log("get log.txt file handle error:", error);
      // setLogErr(`${error}`);
    }
  }

  const HandleConnectedLogUI = () => {
    if(get('log.txt') === null || !logConnect) {
      return(
        <>
          <div className="px-4 py-5 sm:p-4">
            {/* <h3 className="text-base font-semibold leading-6 text-gray-900">Connect Data</h3> */}
            {/* <div className="max-w-xl text-sm text-gray-500">
              <p>allow access to </p>
            </div> */}
            {/* <p className="text-sm text-red-500">{logErr}</p> */}
            <button
              type="button"
              onClick={getGestDataAccess}
              className="inline-flex mt-2 items-center rounded-full bg-blue-500 px-2.5 py-1 text-base font-semibold text-white shadow-sm hover:bg-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              Connect Data
            </button>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="px-4 py-5 sm:p-4">
            <div className="sm:flex sm:items-start sm:justify-between">
              <h3 className="text-sm font-semibold leading-6 text-blue-500">Gesture Data Access Granted</h3>
              <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>
          </div>
        </>
      )
    }
  }

  /* -------------------------------------------------------------------------------------------------------- */

  return (
    <>
      <div>
        <div className="border-b border-gray-200 pb-5">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Device Access
          </h3>
        </div>
        <div className="border-b border-gray-200 pb-5">
        <HandleConnectedDirUI/>
        <HandleConnectedLogUI/>
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-3 rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Reset 
        </button>
      </div>
    </>
  );
};

export default ConnectDevice;