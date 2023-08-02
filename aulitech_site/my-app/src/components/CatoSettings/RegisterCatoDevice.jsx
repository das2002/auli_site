import React, { useState } from "react";
import { get, set } from "idb-keyval";
import { collection, addDoc, where, query, doc, deleteDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

const RegisterCatoDevice = ({ user, handleDeviceCount }) => {
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

          deleteInitializeDoc();
          addDeviceDoc(jsonData);
        }
      } else {
        const dirHandle = await window.showDirectoryPicker({
          id: 'AULI_CATO',
          mode: 'readwrite'
        });
  
        await set('directory', dirHandle);
        console.log('store dir handle:', dirHandle.name);
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
    navigate('/')
  };

  const deleteInitializeDoc = async() => {
    try {
      let id;
      const colRef = collection(db, "users");
      const firstDevice = query(collection(colRef, user.uid, "userCatos"), where("initialize", "==", "initializeUserCatosSubcollection"));
      const newSnap = await getDocs(firstDevice);
      
      newSnap.forEach((doc) => {
        console.log(doc.id)
        id = doc.id;
      })

      if(id) {
        await deleteDoc(doc(colRef, user.uid, "userCatos", id));
      } else {
        return;
      }
    }
    catch(error) {
      console.log("delete initialize doc, userCatos: ", error);
    }
  }

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

      {/* <h3 className="text-base font-semibold leading-6 text-gray-900">Connect Cato</h3> */}
      <p className="mt-2 max-w-4xl text-sm text-gray-500">

        To register a new Cato device, connect it to your computer via cable.
      </p>
    </div>
    <div className="bg-white shadow rounded-lg m-5">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Name your Cato</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Enter a name for your Cato below. 
            <br/>
            <br/>
            When you click <strong>Save</strong> your browser will ask if you want to allow access to the device, allow access in order to register the device.</p>
        </div>
        <div className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="my-cato"
            />
          </div>
          <div className="mt-4 sm:mt-0">
          <button
            disabled={deviceName === "" ? true : false}
            onClick={getJsonData}
            className="inline-flex rounded-full items-center bg-blue-500 sm:mx-4 px-2.5 py-1 text-sm font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-300"
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
