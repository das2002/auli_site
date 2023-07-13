import React, { useState } from "react";
import { get, set, clear } from 'idb-keyval';
import { styles } from "../../junk/Configure";

const ConnectDirectory = ({classNames, reset, handleCatoConnected}) => {
  const [catoConnected, setCatoConnected] = useState(false);

  const handleReset = () => {
    clear();
    setCatoConnected(false);
    return reset;
  }

  const getDirectory = async() => {
    try {
      const dirHandleOrUndefined = await get('directory');

      if (dirHandleOrUndefined) {
        console.log("retrieved dir handle:", dirHandleOrUndefined.name);
        setCatoConnected(true);
        handleCatoConnected(true);
        return;
      }

      const dirHandle = await window.showDirectoryPicker({
        id: 'AULI_CATO',
        mode: 'readwrite'
      });

      await set('directory', dirHandle);
      console.log('store dir handle:', dirHandle.name);
      setCatoConnected(true);
      handleCatoConnected(true);
    }
    catch(error) {
      console.log("get directory error:", error);
    }
  }

  const HandleConnectedUI = () => {
    if(get('directory') === null) {
      return(
        <>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Connect to AULI_CATO</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Click Connect, you will be prompted by your browser to select a directory, select AULI_CATO.</p>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={getDirectory}
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
              <h3 className="text-base font-semibold leading-6 text-blue-500">AULI_CATO Connection</h3>
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
    <div className={classNames(get('directory') !== null ? styles.ACTIVE_RING : "","mt-5 bg-white shadow sm:rounded-lg")}>
      <HandleConnectedUI/>
    </div>
  )

  // return (
  //   <div className={classNames(catoConnected ? styles.ACTIVE_RING : "", "bg-white shadow sm:rounded-lg sm:mx-auto sm:w-full md:max-w-md")}>
  //       <div className="px-4 py-5 sm:p-6">
  //         <h3 className="text-base font-semibold leading-6 text-gray-900">1. Connect Cato</h3>
  //         <div className="mt-2 sm:flex sm:items-start sm:justify-between">
  //           <div className="max-w-xl text-sm text-gray-500">
  //             {catoConnected ? 
  //             <p className="text-blue-500">Connected</p> 
  //             : 
  //             <>
  //               <p>Allow access to your Cato device to continue.</p>
  //               <p className="mt-2">If the connection isn't established when you click Connect you will be prompted by your broswer to select a directory.</p>
  //               <p className="mt-2 text-blue-500">Select AULI_CATO, then 'Edit files'</p>
  //             </>
  //             }
  //           </div>
  //           <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
  //             <button
  //               type="button"
  //               className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
  //               onClick={catoConnected ? handleReset : getDirectory}
  //             >
  //               {catoConnected ? 'Reset Connection' : 'Connect'}
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  // )
};

export default ConnectDirectory;