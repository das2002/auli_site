import { get, set } from "idb-keyval";

const WriteNewConfig = (devices, currIndex) => {

  const writeConfig  = async() => {
    try {
      /* get the directory handle from file ystme API */
      const directory = await get("directory");
      console.log("retrieved dir handle:", directory);

      if (typeof directory !== "undefined") {
        const perm = await directory.requestPermission();

        /* If user has already granted permission to the directory continue*/
        if (perm === "granted") {
          /* Check if file handle for config.json already exists */
          const configHandleOrUndefined = await get("wrtConfigJsn");

          if (configHandleOrUndefined) {
            console.log("retrieved file handle:", configHandleOrUndefined.name);
          }

          /* Get the file handle if it does not already exist */
          const writeFile = await directory.getFileHandle("config.json", {
            create: true,
          });

          /* Write the new config.json file in the AULI_CATO directory */
          const writable = await writeFile.createWritable();
          await writable.write(JSON.stringify(devices[currIndex].jsondata));
          await writable.close();

          /* Set the file handle for config.json */
          await set("wrtConfigJsn", writeFile);
          console.log("stored file handle:", writeFile.name);
        }
      }
    } catch (err) {
      console.log("write config.json error:", err.message);
    }
  }

  return writeConfig();
}

export default WriteNewConfig;