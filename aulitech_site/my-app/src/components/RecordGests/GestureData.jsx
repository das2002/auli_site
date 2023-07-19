import React, { useState } from "react";
import { get } from 'idb-keyval';
import { styles } from "./ConfigureGestures";
import StoreGestData from "../CloudFirestore/StoreGestData";


const GestureData = ({classNames, gestName, user}) => {
  const [gestData, setGestData] = useState(null);

  console.log(user);


  const getGestureData = async() => {
    try {
      const directory = await get('directory');
      console.log(directory);

      if(typeof directory !== 'undefined') {

        const perm = await directory.requestPermission()

        if(perm === 'granted') {
          const logFile = await directory.getFileHandle('log.txt', { create: false });

          const dataFile = await logFile.getFile();
          const dataContents = await dataFile.text();

          setGestData(dataContents);
          StoreGestData(gestName, user, gestData);
        }
      }
    }
    catch(error) {
      console.log("get log.txt/ gesture data error:", error)
    }
  }

  return (
    <>
    <div className={classNames(gestData !== null ? styles.ACTIVE_RING : "", "bg-white shadow sm:rounded-lg sm:mx-auto sm:w-full md:max-w-md")}>
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-base font-semibold leading-6 text-gray-900">5. Collect Gesture Recording</h3>
      <div className="mt-2 sm:flex sm:items-start sm:justify-between">
        <div className="max-w-xl text-sm text-gray-500">
          <p>
            Collect and format your gesture recording data from Cato by clicking Collect.
          </p>
          <p className="mt-2">
            
          </p>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={getGestureData}
          className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Collect
        </button>
      </div>
    </div>
  </div>
  <br/>
    </>
  )
};

export default GestureData;