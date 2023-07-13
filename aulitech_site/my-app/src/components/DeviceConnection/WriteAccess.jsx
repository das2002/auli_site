import React, { useState } from "react";
import { get, set } from 'idb-keyval';
import { styles } from "../../junk/Configure";


const WriteAccess = ({classNames}) => {

  const getWriteAccess = async() => {
    try {
      const directory = await get('directory');
      console.log("retrieved dir handle:", directory);

      if(typeof directory !== 'undefined') {
        const perm = await directory.requestPermission()

        if(perm === 'granted') {
          const writeHandleOrUndefined = await get('gesture.cato');

          if (writeHandleOrUndefined) {
            console.log("retrieved file handle:", writeHandleOrUndefined.name);
            return;
          }

          const writeFile = await directory.getFileHandle('gesture.cato', { create: true });

          await set('gesture.cato', writeFile);
          console.log('stored file handle:', writeFile.name);
          
          const checkConfig = await directory.getFileHandle('config.cato', { create: false })
          if(checkConfig !== null) {
            await set('checkConfig', checkConfig);
            console.log('stored config.cato handle: ', checkConfig.name);
          };
        };
      }
    }
    catch(error) {
      console.log("write config.cato error:", error);
    }
  }

  const HandleConnectedUI = () => {
    if(get('gesture.cato') === null) {
      return(
        <>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Connect to Gesture Recording</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Click Connect, you will be prompted by your browser to select a directory, select AULI_CATO.</p>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={getWriteAccess}
              className="inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Connect
            </button>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-start sm:justify-between">
              <h3 className="text-base font-semibold leading-6 text-blue-500">Cato Command Access Granted</h3>
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
    <div className={classNames(get('gesture.cato') !== null ? styles.ACTIVE_RING : "","mt-5 bg-white shadow sm:rounded-lg")}>
      <HandleConnectedUI/>
    </div>
  )
}

export default WriteAccess;