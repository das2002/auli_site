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
import { db } from "../../firebase";

async function requestDeviceAccess() {
  try {
    const device = await navigator.usb.requestDevice({filters: []});
    console.log("access granted to :", device);
  } catch (error) {
    console.log("access denied to device: ", error);
  }
}

const RegisterCatoDevice = ({ user, devices, handleRenderDevices }) => {
  // console.log('user',user);
  const [parsedJson, setParsedJson] = useState({}); // [parsedJson, setParsedJson
  const [deviceName, setDeviceName] = useState("");
  const [errMessage, setErrMessage] = useState(false);
  const [hwUid, setHwUid] = useState('');


  const navigate = useNavigate();


  const getJsonData = async () => {
    try {

      if (window.showDirectoryPicker) {
        try {
          // request the user to pick a directory
          const dirHandle = await window.showDirectoryPicker({
            id: "AULI_CATO",
            mode: "readwrite",
          });

          // attempt to find the config.json file in the directory
          for await (const entry of dirHandle.values()) {
            if (entry.kind === "file" && entry.name === "config.json") {
              // found the file, read it
              const file = await entry.getFile();
              const jsonDataText = await file.text();
              let parsedJson = JSON.parse(jsonDataText);
              parsedJson.name.value = deviceName;
              let globalConfig = parsedJson;
              if (globalConfig['operation_mode'] != null) {
                delete globalConfig['operation_mode'];
              }
              if (globalConfig['screen_size'] != null) {
                delete globalConfig['screen_size'];
              }
              if (globalConfig['mouse'] != null) {
                delete globalConfig['mouse'];
              }
              if (globalConfig['clicker'] != null) {
                delete globalConfig['clicker'];
              }
              if (globalConfig['tv_remote'] != null) {
                delete globalConfig['tv_remote'];
              }
              if (globalConfig['pointer'] != null) {
                delete globalConfig['pointer'];
              }
              if (globalConfig['bindings'] != null) {
                delete globalConfig['bindings'];
              }
              if (globalConfig['turbo_rate'] != null) {
                delete globalConfig['turbo_rate'];
              }
              console.log("i parsed this and deleted opmode configs", globalConfig);
              
              setParsedJson(parsedJson);
              //setHwUid(parsedJson.HW_UID.value);
              //console.log("hwUid", hwUid);
              addDeviceDoc(parsedJson, globalConfig);
              deleteInitializeDoc();

              // create a sample file
              const fileName = "config.json";
              const fileData = JSON.stringify(parsedJson);
              const fileHandle = await dirHandle.getFileHandle(fileName, {
                create: true,
              });
              const writable = await fileHandle.createWritable();
              await writable.write(fileData);
              await writable.close();

              // create a blob object from the file
              const blob = new Blob([fileData], { type: "application/json" });

              // create a URL for the blob
              const url = URL.createObjectURL(blob);

              // create a link element
              const link = document.createElement("a");
              link.href = url;
              link.download = fileName;

              // simulate a click on the link to download the file
              link.click();

              // remove the link from the DOM
              link.remove();

              return;              
            }
          }
        } catch (error) {
          console.log("get config.json error:", error);
        }
      } else {
        console.log("file system access not supported");
      }
    } catch (error) {
      console.log("get config.json error:", error);
    }

    const getName = () => {
      return parsedJson.name.value;
    }
  };

  useEffect(() => {
    console.log("parsedJson", parsedJson);
    if (parsedJson && Object.keys(parsedJson).length > 0) {
      setHwUid(parsedJson.HW_UID.value);
    }
  }, [parsedJson]);



  function changeConfigDevName(jsonData) {
    try {
      jsonData.name.value = deviceName;
      console.log(jsonData.name.value)
    } catch (error) {
      console.log("changeConfigDevName error: ", error);
    }
  }

  const addDeviceDoc = (parsedJson, globalConfig) => {
    try {
      const storeDevice = async () => {
        try {
          //let parsedJson = JSON.parse(jsonData);      
          const newData = JSON.stringify(parsedJson)
          const globalData = JSON.stringify(globalConfig)

          const colRef = collection(db, "users");
          await addDoc(collection(colRef, user.uid, "userCatos"), {
            device_info: {
              HW_UID: parsedJson.HW_UID.value,
              device_nickname: deviceName,
              global_config: globalData,
            },
            connection:[],
            // current_config: newData,
          });
          handleRenderDevices();
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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">
            Register new device
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
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
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
                disabled={deviceName === "" ? true : false}
                onClick={getJsonData}
                className="inline-flex rounded-full items-center bg-blue-500 px-2.5 py-1 text-lg font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-300"
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