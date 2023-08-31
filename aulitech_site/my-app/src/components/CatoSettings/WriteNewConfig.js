import { get, set } from "idb-keyval";


const WriteNewConfig = (devices, currIndex) => {
  console.log(devices);
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

          const writable = await writeFile.createWritable();
          await writable.write(JSON.stringify(devices[currIndex].jsondata));
          await writable.close();

          await set("wrtConfigJsn", writeFile);
          console.log("stored file handle:", writeFile.name);
        }
      }
    } catch (err) {
      // setErrMsg(`${err.message}`)
      console.log("write config.json error:", err.message);
    }
  }

  return writeConfig();
}

export default WriteNewConfig;