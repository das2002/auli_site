import React, { useState } from "react";
import { get, set } from "idb-keyval";
import {
  collection,
  addDoc,
  where,
  query,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

const RegisterCatoDevice = ({ user, devices, handleDeviceCount }) => {
  const [deviceName, setDeviceName] = useState("");
  const [errMessage, setErrMessage] = useState(false);
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

          deleteInitializeDoc();
          addDeviceDoc(jsonData);
        }
      } else {
        const dirHandle = await window.showDirectoryPicker({
          id: "AULI_CATO",
          mode: "readwrite",
        });

        await set("directory", dirHandle);
        console.log("store dir handle:", dirHandle.name);
        getJsonData();
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
          handleDeviceCount(1);
        } catch (error) {
          console.log("store another device error: ", error);
        }
      };
      storeDevice();
    } catch (error) {
      console.log("add device doc to usersCato error: ", error);
    }
    navigate("/");
  };

  const deleteInitializeDoc = async () => {
    try {
      let id;
      const colRef = collection(db, "users");
      const firstDevice = query(
        collection(colRef, user.uid, "userCatos"),
        where("initialize", "==", "initializeUserCatosSubcollection")
      );
      const newSnap = await getDocs(firstDevice);

      newSnap.forEach((doc) => {
        console.log(doc.id);
        id = doc.id;
      });

      if (id) {
        await deleteDoc(doc(colRef, user.uid, "userCatos", id));
      } else {
        return;
      }
    } catch (error) {
      console.log("delete initialize doc, userCatos: ", error);
    }
  };

  // const DirHandleExists = () => {
  //   devices.forEach((device) => {
  //     if(device.data.devicename === deviceName) {
  //       setErrMessage(true);
  //       return (
  //         <p>Name already exists</p>
  //       )
  //     }
  //   })
  // }

  return (
    <div className="flex min-h-full flex-col">
      <header className="shrink-0 bg-transparent">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">
            Register new device
          </h2>
        </div>
      </header>

      <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-8 pb-5">
        <p className="max-w-4xl text-lg text-gray-900">
          To register a new Cato device, connect it to your computer via cable.
        </p>
      </div>
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-5 mt-10">
        <div className="px-4 py-5 sm:p-6 lg:px-8">
          <div className="border-b border-gray-200 pb-5">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              Name your Cato
            </h3>
          </div>
          <div className="mt-5 max-w-xl text-lg text-gray-900">
            <p>Enter a name for your Cato below.</p>
          </div>
          <div className="w-full mt-5 sm:max-w-xs">
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="block w-full rounded-md border-0 px-2.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-900 sm:text-md sm:leading-6"
                placeholder="my-cato"
              />
            </div>
          <div className="mt-5 max-w-xl text-lg text-gray-900">
            <p>
              When you click <strong>Save</strong> your browser will ask if you
              want to allow access to the device, allow access in order to
              register the device.
            </p>
          </div>
          <div className="mt-5 sm:flex sm:items-center">
            
            <div className="mt-4 sm:mt-0">
              <button
                disabled={deviceName === "" ? true : false}
                onClick={getJsonData}
                className="inline-flex rounded-full items-center bg-blue-500 px-2.5 py-1 text-xl font-semibold text-white disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-blue-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div>
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
      <button onClick={getJsonData}>get config.json</button> */}
    </div>
  );
};

export default RegisterCatoDevice;
