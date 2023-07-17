import React from "react";
import { get, set } from 'idb-keyval';



const GetJson = () => {
  const getJsonData = async() => {
    try {
      const directory = await get('directory');
      console.log(directory);

      if(typeof directory !== 'undefined') {
        const perm = await directory.requestPermission()

        if(perm === 'granted') {
          const jsonHandleOrUndefined = await get('config.json');

          if (jsonHandleOrUndefined) {
            console.log("retrieved file handle:", jsonHandleOrUndefined.name);
            return;
          }

          const jsonFile = await directory.getFileHandle('config.json', { create: false });

          await set('config.json', jsonFile);
          console.log('stored file handle:', jsonFile.name);

          const jsonDataFile = await jsonFile.getFile();
          const jsonData = await jsonDataFile.text();
          console.log(jsonData);
        }
      }
    }
    catch(error) {
      console.log("get log.txt/ gesture data error:", error)
    }
  }

  return (
    <>
      <button
        onClick={getJsonData}
      >
        Get Json Data
      </button>
    </>
  )
}

export default GetJson;