import React from "react";
import { get, set } from "idb-keyval";
import StoreGestData from "../../CloudFirestore/StoreGestData";

const GestureData = (user, gestName, handleStepCount, handleGotData, handleSetErr) => {
  const getGestureData = async () => {
    try {
      const directory = await get("directory");
      console.log(directory);

      if (typeof directory !== "undefined") {
        const perm = await directory.requestPermission();

        if (perm === "granted") {
          const exisitingLogHandle = await get('log');
          let dataFile;

          if (exisitingLogHandle) {
            console.log("retrieved file handle:", exisitingLogHandle.name);

            dataFile = await exisitingLogHandle.getFile();
          } else {
            const logFile = await directory.getFileHandle("log.txt", {
              create: false,
            });

            await set('log', logFile);
            console.log('stored file handle:', logFile.name);

            dataFile = await logFile.getFile();
          }

          const dataContents = await dataFile.text();
          console.log(dataContents);

          if (typeof dataContents !== "undefined") {
            handleStepCount();
            handleGotData(true);
            StoreGestData(gestName, user, dataContents);
          }
        }
      }
    } catch (err) {
      handleSetErr(err);
      handleGotData(false);
      console.log("get log.txt/ gesture data error:", err);
    }
  };

  return getGestureData();
}

export default GestureData;