import React, { useEffect, useState } from "react";
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
import { db, auth } from "../../firebase";
import * as newDeviceConfig from '../../resources/templates/new_device_config.json';


const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const getCurrentUserId = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return currentUser.uid;
  } else {
    return null;
  }
}

const RegisterCatoDevice = ({ user, devices, handleRenderDevices }) => {
  const [enteredName, setEnteredName] = useState(""); // [enteredName, setEnteredName
  const [parsedJson, setParsedJson] = useState({}); // [parsedJson, setParsedJson
  //const [newConfig, setNewConfig] = useState({}); // [newConfig, setNewConfig
  const [deviceName, setDeviceName] = useState("");
  const [errMessage, setErrMessage] = useState(false);
  const [hwUid, setHwUid] = useState('');

  console.log('user', user);
  console.log('devices', devices);

  const checkIfNameTaken = async () => {
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].data.device_info.device_nickname === enteredName) {
        return true;
      }
    }
    return false;
  }

  const downloadSequence = async () => {
    if (enteredName === "") {
      return;
    } 
    const nameTaken = await checkIfNameTaken();
    console.log("nameTaken", nameTaken);
    if (nameTaken) {
      setErrMessage(true);
      return;
    } 
    setDeviceName(enteredName);
    const retrievedJson = await getJsonData();
    console.log("retrievedJson", retrievedJson);
    if (retrievedJson == null) {
      return;
    }
    let newConfig = deepCopy(newDeviceConfig);

    newConfig["global_info"]["HW_UID"]["value"] = retrievedJson["global_info"]["HW_UID"]["value"];
    newConfig.global_info.name.value = enteredName;
    const deviceAdded = addDeviceDoc(newConfig);
    if (!deviceAdded) {
      return;
    }
    deleteInitializeDoc();
    downloadNewConfig(newConfig);
    navigate("/");
  };


  const navigate = useNavigate();

  //go into resources/templates and find new_device_config.json
  const downloadNewConfig = async (newDeviceConfig) => {
    try {
      const blob = new Blob([JSON.stringify(newDeviceConfig)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "config.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("download new config error: ", error);
    }
  };

  const getJsonData = async () => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
  
        const iterateDirectory = async (dirHandle) => {
          for await (const entry of dirHandle.values()) {
            if (entry.kind === "file" && entry.name === "config.json") {
              console.log("found config.json");
              const file = await entry.getFile();
              const jsonDataText = await file.text();
              const retrievedJson = JSON.parse(jsonDataText);
              setParsedJson(retrievedJson);
              setHwUid(retrievedJson.global_info.HW_UID.value);
              return retrievedJson;
            } else if (entry.kind === "directory") {
              const found = await iterateDirectory(entry);
              if (found != null) {
                return found;
              }
            }
          }
          return null;
        };
  
        const found = await iterateDirectory(dirHandle);
        if (!found) {
          console.log("config.json file not found");
          return null;
        }
        return found;
      } else {
        console.log("showDirectoryPicker is not supported in this browser");
        return null;
      }
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  };

  const addDeviceDoc = async (newDeviceConfig) => {
    try {
      const storeDevice = async () => {
        try {
          const newData = JSON.stringify(newDeviceConfig);
          const hwUid = newDeviceConfig.global_info.HW_UID.value;
          const deviceName = newDeviceConfig.global_info.name.value;
          const colRef = collection(db, "users");
          await addDoc(collection(colRef, user.uid, "userCatos"), {
            device_info: {
              global_config: newData,
              device_nickname: deviceName,
              hw_uid: hwUid,
            },
            connections: []
          });
          handleRenderDevices();
        } catch (error) {
          console.log("store another device error: ", error);
          return false;
        }
      };
      storeDevice();
      return true;
    } catch (error) {
      console.log("add device doc to usersCato error: ", error);
      return false;
    }
  }

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

  return (
    <div className="flex min-h-full flex-col">
        <div className="ml-90">
          <header className="shrink-0 bg-transparent border-b border-gray-200">
            <div className="ml-0 flex h-16 max-w-7xl items-center justify-between ">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Register New Device
              </h2>
            </div>
            <div className="border-b border-gray-200 pb-5">
              <p className="max-w-4xl text-lg text-gray-900">
                To register a new Cato device, connect it to your computer via cable.
              </p>
            </div>
          </header>
        </div>
      <div className="px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-5 mt-10">
        <div className="px-4 py-5 sm:p-6 lg:px-8">
          <div className="border-b border-gray-200 pb-10">
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
                value={enteredName}
                onChange={(e) => setEnteredName(e.target.value)}
                className="block w-full rounded-md border-0 outline-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-md sm:leading-6"
                placeholder="my-cato"
              />
            </div>
            <div className="mt-5 max-w-xl text-lg text-gray-900">
              <p>
                When you click <strong>Save</strong> your browser will ask if
                you want to allow access to the device, allow access in order to
                register the device.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end">
            <div className="mt-4 sm:mt-0">
              <button
                disabled={enteredName === "" ? true : false}
                onClick={downloadSequence}
                className="decision-button inline-flex rounded-full items-center bg-blue-500 px-2.5 py-1 text-lg font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:opacity-70"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RegisterCatoDevice;