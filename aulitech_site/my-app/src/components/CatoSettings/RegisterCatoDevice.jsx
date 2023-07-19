import React, { useState } from "react";
import { get, set } from "idb-keyval";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

const RegisterCatoDevice = ({ user }) => {
  const [deviceName, setDeviceName] = useState("");
  //   const [hwUid, setHwUid] = useState('');

  const navigate = useNavigate();

  const getJsonData = async () => {
    try {
      const directory = await get("directory");
      console.log(directory);

      if (typeof directory !== "undefined") {
        const perm = await directory.requestPermission();

        if (perm === "granted") {
          const jsonHandleOrUndefined = await get("config.json");

          if (jsonHandleOrUndefined) {
            console.log("retrieved file handle:", jsonHandleOrUndefined.name);
          }

          const jsonFile = await directory.getFileHandle("config.json", {
            create: false,
          });

          await set("config.json", jsonFile);
          console.log("stored file handle:", jsonFile.name);

          const jsonDataFile = await jsonFile.getFile();
          const jsonData = await jsonDataFile.text();

          addDeviceDoc(jsonData);
        }
      }
    } catch (error) {
      console.log("get config.json error:", error);
    }
  };

    // const getHWuid = (jsonData) => {
    //   const parsedJson = JSON.parse(jsonData);
    //   setHwUid(parsedJson.name);
    // }

  const addDeviceDoc = (jsonData) => {

    try {
      const storeDevice = async () => {
        try {
          const colRef = collection(db, "users");
          await addDoc(collection(colRef, user.uid, "userCatos"), {
            // hardwareuid: hwUid,
            devicename: deviceName,
            configjson: jsonData,
          });
        } catch (error) {
          console.log("store another device error: ", error);
        }
      };
      storeDevice();
    } catch (error) {
      console.log("add device doc to usersCato error: ", error);
    }
    navigate('/')
  };

  return (
    <>
      <h1>Register Cato Device</h1>

      <div>
        <label>
          Device Name
          <input
            type="text"
            value={deviceName}
            className="bg-gray-100"
            onChange={(e) => setDeviceName(e.target.value)}
          />
        </label>
      </div>
      <button onClick={getJsonData}>get config.json</button>
    </>
  );
};

export default RegisterCatoDevice;
