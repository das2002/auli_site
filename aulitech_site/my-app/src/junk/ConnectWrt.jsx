import React, { useState, useEffect } from "react";
import { get, set, clear } from 'idb-keyval';
import { styles } from "../components/RecordGests/ConfigureGestures";


const ConnectWrt = ({classNames, doReset}) => {
  const [show, setShow] = useState(doReset);



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
            return;
          }

          const writeFile = await directory.getFileHandle('gesture.cato');

          await set('gesturecato', writeFile);
          console.log('stored file handle:', writeFile.name);
          setShow(false);
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

  const HandleConnectedUI = () => {
    if(get('gesture.cato') === null || show) {
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

  return (
    <div >
      <HandleConnectedUI/>
    </div>
  )
}

export default ConnectWrt;