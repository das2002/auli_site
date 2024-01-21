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
import * as clickerDefault from '../NavBar/cato_schemas/clicker.json';
import * as mouseDefault from '../NavBar/cato_schemas/mouse.json';
import * as gestureDefault from '../NavBar/cato_schemas/gesture.json';
import * as tvRemoteDefault from '../NavBar/cato_schemas/tv_remote.json';
import * as bindingsDefault from '../NavBar/cato_schemas/bindings.json';
import * as practiceDefault from '../NavBar/cato_schemas/practice.json';
import * as connectionSpecificDefault from '../NavBar/cato_schemas/connection_specific.json';
import * as operationDefault from '../NavBar/cato_schemas/operation.json';
import * as globalInfoDefault from '../../resources/templates/global_info_default.json';



const modeDefaultGenerator = (mode) => {
  if (mode === "pointer") {
    let pointerOperationDefault = deepCopy(operationDefault);
    pointerOperationDefault["value"] = "pointer";
    let pointerData = {
      ...pointerOperationDefault,
      ...mouseDefault,
      ...bindingsDefault
    };
    return pointerData;
  } else if (mode === "clicker") {
    let clickerOperationDefault = deepCopy(operationDefault);
    clickerOperationDefault["value"] = "clicker";
    let clickerData = {
      ...clickerOperationDefault,
      ...clickerDefault,
      ...bindingsDefault
    };
    return clickerData;
  } else if (mode === "gesture_mouse") {
    let gestureMouseOperationDefault = deepCopy(operationDefault);
    gestureMouseOperationDefault["value"] = "gesture_mouse";
    let gestureMouseData = {
      ...gestureMouseOperationDefault,
      ...mouseDefault,
      ...bindingsDefault,
      ...gestureDefault
    };
    return gestureMouseData;

  } else if (mode === "tv_remote") {
    let tvRemoteOperationDefault = deepCopy(operationDefault);
    tvRemoteOperationDefault["value"] = "tv_remote";
    let tvRemoteData = {
      ...tvRemoteOperationDefault,
      ...tvRemoteDefault,
      ...bindingsDefault,
      ...gestureDefault
    };
    return tvRemoteData;

  } else if (mode === "practice") {
    let practiceOperationDefault = deepCopy(operationDefault);
    practiceOperationDefault["value"] = "practice";
    let practiceData = {
      ...practiceOperationDefault,
      ...practiceDefault,
      ...gestureDefault,
      ...bindingsDefault
    };
    return practiceData;
  }

}


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
  const [deviceName, setDeviceName] = useState("");
  const [errMessage, setErrMessage] = useState(false);
  const [hwUid, setHwUid] = useState('');

  console.log('user', user);
  console.log('devices', devices);

  async function fetchAndCompareConfig() {
    async function checkIfHardwareUidTaken(hwUidToCheck) {
      try {
        const colRef = collection(db, "users", user.uid, "userCatos");
        const hwUidQuery = query(colRef, where("device_info.hw_uid", "==", hwUidToCheck));
        const querySnapshot = await getDocs(hwUidQuery);
        return !querySnapshot.empty;
      } catch (error) {
        console.error("Error checking hw_uid in Firebase:", error);
        return false;
      }
    }
    async function checkIfNameTaken() {
      for (let i = 0; i < devices.length; i++) {
        if (devices[i].data.device_info.device_nickname === enteredName) {
          return true;
        }
      }
      return false;
    }

    async function checkIfNameValid() {
      console.log("enteredName", enteredName);
      if (enteredName === "") {
        return false;
      }
      return true;
    }

    try {
      // check existence directories
      let directoryHandle = await get('configDirectoryHandle');
  
      // request + store in indexedDB
      if (!directoryHandle) {
        directoryHandle = await window.showDirectoryPicker();
        await set('configDirectoryHandle', directoryHandle);
      }
  
      // get r/w access
      const permissionStatus = await directoryHandle.requestPermission({ mode: 'readwrite' });
      console.log('Permission Status:', permissionStatus);
      if (permissionStatus !== 'granted') {
        console.log('Permission to access directory not granted');
        return;
      }
  
      // check if config.json exists
      const fileHandle = await directoryHandle.getFileHandle('config.json', { create: false });
  
      //delete + create again
      const file = await fileHandle.getFile();
  
      // read config.json
      const text = await file.text();
      const config = JSON.parse(text);
  
      // check if there is a deviceHwUid
      if (!config || !config.global_info || !config.global_info.HW_UID || !config.global_info.HW_UID.value) {
        console.error("HW_UID is empty or not found in the JSON structure");
        return;
      }
      const deviceHwUid = config.global_info.HW_UID.value;

      // check if hw_uid is taken
      const hwUidTaken = await checkIfHardwareUidTaken(deviceHwUid);
      if (hwUidTaken) {
        setErrMessage("A device with this HW_UID already exists");
        return;
      }

      setHwUid(deviceHwUid);

      // check if name is taken
      const nameTaken = await checkIfNameTaken();
      if (nameTaken) {
        setErrMessage("Name already taken");
        return;
      }

      // check if name is valid
      const nameValid = await checkIfNameValid();
      if (!nameValid) {
        setErrMessage("Invalid name");
        return;
      }

      // if all checks pass return the config
      return config;
      
    } catch (error) {
      console.log("Error:", error);
      return;
    }
  }

  async function getGlobalInfoData(config) {
    async function checkIfGlobalSectionExists(config) {
      if (!config || !config.global_info) {
        console.error("global_info section not found in the JSON structure");
        return false;
      }
      return true;
    }

    //basically, for every field in the globalInfoDefault, check if it exists in the config
    //if it does, add it to the globalInfoData object
    //if it doesn't, add the default value to the globalInfoData object
    
    let globalInfoData = deepCopy(globalInfoDefault);
    let globalInfoExists = await checkIfGlobalSectionExists(config);
    if (!globalInfoExists) {
      return globalInfoData;
    }

    function updateNestedFields(source, target) {
      for (const key in source) {
        if (target.hasOwnProperty(key)) {
          if (typeof source[key] === 'object' && typeof target[key] === 'object') {
            updateNestedFields(source[key], target[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
    }


    updateNestedFields(config.global_info, globalInfoData.global_info);

    if (globalInfoData["default"] != null) {
      delete globalInfoData["default"];
    }

    globalInfoData.global_info.name.value = enteredName;
    //globalInfoData.global_info.HW_UID.value = config.globalInfoData.HW_UID.value;
    return globalInfoData;
  }

  async function getConnectionsData(config) {
    async function checkIfConnectionsSectionExists(config) {
      if (!config || !config.connections) {
        console.error("connections section not found in the JSON structure");
        return false;
      }
      return true;
    }

    let connectionsArray = [];
    let connectionsExist = await checkIfConnectionsSectionExists(config);
    if (connectionsExist) {
      for (let i = 0; i < config["connections"].length; i++) {
        console.log("connection", config["connections"][i]);

        let connection = config["connections"][i];

        if (connection["operation_mode"]["value"] === "practice") {
          continue;
        } else {
          let currentOperationMode = connection["operation_mode"]["value"];
          let currentConnectionConfig = {
            connection_name: { ...connection["connection_name"] },
            screen_size: { ...connection["screen_size"] },
          };

          console.log("currentConnectionConfig", currentConnectionConfig);

          let currentModeConfig = {};
          let modeMap = {};
          if (currentOperationMode == "pointer") {
            currentModeConfig = {
              operation_mode: { ...connection["operation_mode"] },
              mouse: { ...connection["mouse"] },
              bindings: { ...connection["bindings"] }
            }
            modeMap = {
              pointer: JSON.stringify(currentModeConfig),
              clicker: JSON.stringify(modeDefaultGenerator("clicker")),
              gesture_mouse: JSON.stringify(modeDefaultGenerator("gesture_mouse")),
              tv_remote: JSON.stringify(modeDefaultGenerator("tv_remote"))
            }
          } else if (currentOperationMode == "tv_remote") {
            currentModeConfig = {
              operation_mode: { ...connection["operation_mode"] },
              tv_remote: { ...connection["tv_remote"] },
              bindings: { ...connection["bindings"] },
              gesture: { ...connection["gesture"] }
            }
            modeMap = {
              pointer: JSON.stringify(modeDefaultGenerator("pointer")),
              clicker: JSON.stringify(modeDefaultGenerator("clicker")),
              gesture_mouse: JSON.stringify(modeDefaultGenerator("gesture_mouse")),
              tv_remote: JSON.stringify(currentModeConfig)
            }
          } else if (currentOperationMode == "gesture_mouse") {
            currentModeConfig = {
              operation_mode: { ...connection["operation_mode"] },
              mouse: { ...connection["mouse"] },
              bindings: { ...connection["bindings"] },
              gesture: { ...connection["gesture"] }
            }
            modeMap = {
              pointer: JSON.stringify(modeDefaultGenerator("pointer")),
              clicker: JSON.stringify(modeDefaultGenerator("clicker")),
              gesture_mouse: JSON.stringify(currentModeConfig),
              tv_remote: JSON.stringify(modeDefaultGenerator("tv_remote"))
            }
          } else if (currentOperationMode == "clicker") {
            currentModeConfig = {
              operation_mode: { ...connection["operation_mode"] },
              clicker: { ...connection["clicker"] },
              bindings: { ...connection["bindings"] }
            }
            modeMap = {
              pointer: JSON.stringify(modeDefaultGenerator("pointer")),
              clicker: JSON.stringify(currentModeConfig),
              gesture_mouse: JSON.stringify(modeDefaultGenerator("gesture_mouse")),
              tv_remote: JSON.stringify(modeDefaultGenerator("tv_remote"))
            }
          }
          let firebaseConnectionConfig = {
            connection_config: JSON.stringify(currentConnectionConfig),
            mode: modeMap,
            current_mode: currentOperationMode,
            name: connection["connection_name"]["value"],
          }
          connectionsArray.push(firebaseConnectionConfig);
        }
      }
    }
    if (connectionsArray.length === 0) {
      let connectionConfig = JSON.stringify(connectionSpecificDefault);
      let current_mode = "practice";
      let modeMap = {
        pointer: JSON.stringify(modeDefaultGenerator("pointer")),
        clicker: JSON.stringify(modeDefaultGenerator("clicker")),
        gesture_mouse: JSON.stringify(modeDefaultGenerator("gesture_mouse")),
        tv_remote: JSON.stringify(modeDefaultGenerator("tv_remote"))
      };
      let connectionName = "default";
      let firebaseConnectionConfig = {
        connection_config: connectionConfig,
        mode: modeMap,
        current_mode: current_mode,
        name: connectionName,
      };
      connectionsArray.push(firebaseConnectionConfig);
    }
    return connectionsArray;
  }

  const downloadSequence = async () => {
    setDeviceName(enteredName);
    let retrievedJson = await fetchAndCompareConfig();
    console.log("retrievedJson", retrievedJson);
    if (retrievedJson == null) {
      return;
    }
    let globalInfoData = await getGlobalInfoData(retrievedJson);
    console.log("globalInfoData", globalInfoData);
    let connectionsArray = await getConnectionsData(retrievedJson);
    console.log("connectionsArray", connectionsArray);

    const deviceAdded = await addDeviceDoc(globalInfoData, connectionsArray);
    console.log("deviceAdded", deviceAdded);

    /*
    console.log(enteredName);
    console.log(encodeURIComponent(enteredName))

    if (deviceAdded) {
      navigate(`/devices/${encodeURIComponent(enteredName)}`); // Navigate to the new device's settings
    } else {
      console.error("Failed to add device.");
    }

    // const 
    if (!deviceAdded) {
      return;
    }
    deleteInitializeDoc();
    //downloadNewConfig(newConfig);
    */
    
    navigate(`/devices/${enteredName}`);
    window.location.reload();
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


  const addDeviceDoc = async (globalInfoData, connectionsArray) => {
    console.log(globalInfoData);
    console.log(connectionsArray);
    try {
      const storeDevice = async () => {
        try {
          let practiceData = modeDefaultGenerator("practice");
          let practiceDataString = JSON.stringify(practiceData);
          const newData = JSON.stringify(globalInfoData);
          //const hwUid = newDeviceConfig.global_info.HW_UID.value;
          //const deviceName = newDeviceConfig.global_info.name.value;

          const colRef = collection(db, "users");

          async function checkUserCatosCollectionExists(collectionName) {
            try {
              const collectionRef = collection(db, "users", user.uid, collectionName);
              const snapshot = await getDocs(collectionRef);
              return !snapshot.empty;
            } catch (error) {
              console.error("Error checking collection existence:", error);
              return false;
            }
          }

          const userCatosCollectionExists = await checkUserCatosCollectionExists("userCatos");
          if (!userCatosCollectionExists) {
            console.log("userCatos collection does not exist");
            await addDoc(collection(colRef, user.uid, "userCatos"), {
              initialize: "initializeUserCatosSubcollection",
            });
          }
          
          await addDoc(collection(colRef, user.uid, "userCatos"), {
            device_info: {
              global_config: newData,
              device_nickname: enteredName,
              hw_uid: globalInfoData.global_info.HW_UID.value,
              practice_config: practiceDataString,
            },
            connections: connectionsArray,
          });
          handleRenderDevices();
          deleteInitializeDoc();
          
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
      <header className="shrink-0 bg-transparent">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">
            Register New Device
          </h2>
        </div>
      </header>

      <div className="border-b border-gray-200 pb-5">
        <p className="max-w-4xl text-lg text-gray-900">
          To register a new Cato device, connect it to your computer via cable.
        </p>
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
                  className="inline-flex rounded-full items-center bg-blue-500 px-2.5 py-1 text-lg font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-300"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          {errMessage && (
            <div className="text-red-500">
              {errMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterCatoDevice;