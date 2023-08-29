import React from "react";
import { get, set } from "idb-keyval";

export default function WriteAccess({setWriteConnect, setStartGest}) {

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
            setWriteConnect(true);
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
          setWriteConnect(true);
          setStartGest(true);
          
        }
      }
    } catch (error) {
      console.log("write config.cato error:", error);
    }
  };

  return getWriteAccess();
}