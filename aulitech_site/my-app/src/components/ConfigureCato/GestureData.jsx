import React, { useState } from "react";
import { get } from 'idb-keyval';
import { styles } from "../../junk/Configure";
import StoreGestData from "../CloudFirestore/StoreGestData";


const GestureData = ({classNames, gestures}) => {
  const [gestData, setGestData] = useState(null);
  const [formattedData, setFormattedData] = useState([]);
  // const [gest, setGest] = useState('');
  // const [mappedData, setMappedData] = useState([]);
  const [gestName, setGestName] = useState('');
  const [nowStore, setNowStore] = useState(false);

  const handleFormat = async(data) => {
    const lineSeperated = data.split('\n');
    const mapped = [];

    const commaSeperated = [];
    lineSeperated.forEach((line) => {
      commaSeperated.push(line.split(','));
    })

  for(let i=0; i < commaSeperated.length - 1; i++) {
    let dataObj = {};

    commaSeperated[i].map((value, index) => {
      switch (index) {
          case 0 :
            return dataObj.ax = value;
          case 1 :
            return dataObj.ay = value;
          case 2 :
            return dataObj.az = value;
          case 3 : 
            return dataObj.gx = value;
          case 4 :
            return dataObj.gy = value;
          case 5 :
            return dataObj.gz = value;
          case 6 : 
            return setGestName(gestures[parseInt(value)].name);
          default:
            return null;
        };

      })
      mapped.push(dataObj);
      console.log(mapped);
    };
    setFormattedData(mapped);
    setNowStore(true);
  }


  const getGestureData = async() => {
    try {
      const directory = await get('directory');
      console.log(directory);

      if(typeof directory !== 'undefined') {

        const perm = await directory.requestPermission()

        if(perm === 'granted') {
          const logFile = await directory.getFileHandle('log.txt', { create: false });
          console.log(logFile);

          const dataFile = await logFile.getFile();
          const dataContents = await dataFile.text();
          console.log(dataContents);
          setGestData(dataContents);
          handleFormat(dataContents);
        }
      }
    }
    catch(error) {
      console.log("get log.txt/ gesture data error:", error)
    }
  }

  // const handleStoreGestName = (gestName) => {
  //   setGest(gestName);
  // }

  // const handleStoreGestData = () => {
  //   console.log(gestName)
  //   StoreGestData(gestName, formattedData)
  // }

  return (
    <>
    <div className={classNames(gestData !== null ? styles.ACTIVE_RING : "", "bg-white shadow sm:rounded-lg sm:mx-auto sm:w-full md:max-w-md")}>
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-base font-semibold leading-6 text-gray-900">Collect Gesture Recording</h3>
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
  <StoreGestData classNames={classNames} gesture={gestName} logFile={formattedData} activeStore={nowStore}/>
    </>
  )
};

export default GestureData;