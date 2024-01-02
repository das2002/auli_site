import React, {useState} from "react";
import { db } from "../../firebase";
import { collection, query, where, getDoc, doc } from "firebase/firestore";
import { get, set } from 'idb-keyval';

import GetJson from "./GetJson";
import OperationMode from "./OperationMode";
import CatoName from "./Name";
import EditScreenSize from "./ScreenSize";

const EditCatoSettings = ({classNames, user}) => {
  const [catoConfig, setCatoConfig] = useState(null);

  const getJsonData = async() => {
    let settingsData;

    try {
      const colRef = doc(db, "users", user.uid);

      const configQuery = query(colRef);
      const docIdSnapshot = await getDoc(configQuery);

      settingsData = docIdSnapshot.data().configjson;
      handleJsonDataState(JSON.parse(settingsData));
    }
    catch(error) {
      console.log(error);
    }
  }
  

  const handleJsonDataState= (docData) => {
    setCatoConfig(docData);
    console.log(catoConfig);
    // console.log(catoConfig.operation_mode);
  };


  return(
    <>
      <button
        onClick={getJsonData}
      >
        Get Json Data
      </button>
      <ul role="list" className="divide-y divide-gray-200">
        <li className="py-4">
          <CatoName jsonData={catoConfig}/>
        </li>
        <li className="py-4">
          <OperationMode classNames={classNames} jsonData={catoConfig}/>
        </li>
        <li className="py-4">
          <EditScreenSize jsonData={catoConfig}/>
        </li>
    </ul>
    </>
  )
};

export default EditCatoSettings;


// const getJsonData = async() => {
//   try {
//     const directory = await get('directory');
//     console.log(directory);

//     if(typeof directory !== 'undefined') {
//       const perm = await directory.requestPermission()

//       if(perm === 'granted') {
//         const jsonHandleOrUndefined = await get('config.json');

//         if (jsonHandleOrUndefined) {
//           console.log("retrieved file handle:", jsonHandleOrUndefined.name);
//           return;
//         }

//         const jsonFile = await directory.getFileHandle('config.json', { create: false });

//         await set('config.json', jsonFile);
//         console.log('stored file handle:', jsonFile.name);

//         const jsonDataFile = await jsonFile.getFile();
//         const jsonData = await jsonDataFile.text();
//         console.log(jsonData);
//       }
//     }
//   }
//   catch(error) {
//     console.log("get log.txt/ gesture data error:", error)
//   }
// }