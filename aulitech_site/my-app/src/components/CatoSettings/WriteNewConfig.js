import { get, set } from "idb-keyval";


export default function WriteNewConfig({devices, currIndex}) {
  const writeConfig  = async() => {
    try {
      const directory = await get("directory");
      console.log("retrieved dir handle:", directory);

      if (typeof directory !== "undefined") {
        const perm = await directory.requestPermission();

        if (perm === "granted") {
          const configHandleOrUndefined = await get("wrtConfigJsn");

          if (configHandleOrUndefined) {
            console.log("retrieved file handle:", configHandleOrUndefined.name);
          }

          const writeFile = await directory.getFileHandle("config.json", {
            create: true,
          });

          console.log(writeFile);

          const writable = await writeFile.createWritable();
          await writable.write(devices[currIndex].jsondata);
          await writable.close();

          await set("wrtConfigJsn", writeFile);
          console.log("stored file handle:", writeFile.name);
        }
      }
    } catch (err) {
      // setErrMsg(`${err.message}`)
      console.log("write config.cato error:", err.message);
    }
  }

  return writeConfig();
}