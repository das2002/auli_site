import React from "react";
import { get, set } from "idb-keyval";

const WriteAccess = (handleWriteConnect) => {

  const getWriteAccess = async () => {
    try {
      const directory = await get("directory");
      console.log("retrieved dir handle:", directory);

      if (typeof directory !== "undefined") {
        const perm = await directory.requestPermission();

        if (perm === "granted") {
          const writeHandleOrUndefined = await get("gesture.cato");

          if (writeHandleOrUndefined) {
            console.log("retrieved file handle:", writeHandleOrUndefined.name);
          }

          const writeFile = await directory.getFileHandle("gesture.cato", {
            create: true,
          });

          console.log(writeFile);

          const writable = await writeFile.createWritable();
          await writable.write('');
          await writable.close();

          await set("gesture.cato", writeFile);
          console.log("stored file handle:", writeFile.name);
          handleWriteConnect(true);
        }
      }
    } catch (err) {
      // setErrMsg(`${err.message}`)
      console.log("write gesture.cato error:", err.message);
      handleWriteConnect(false);
    }
  };

  return getWriteAccess();
}

export default WriteAccess;