import React from "react";
import { clear, get, set } from "idb-keyval";
// import ConnectDirectory from "./ConnectDirectory";
// import GestDataAccess from "./GestDataAccess";
// import WriteAccess from "./WriteAccess";

const DeviceAccess = ({ classNames }) => {
  const reset = () => {
    clear();
  };

  const getDirectory = async () => {
    try {
      const dirHandleOrUndefined = await get("directory");

      if (dirHandleOrUndefined) {
        console.log("retrieved dir handle:", dirHandleOrUndefined.name);
        return;
      }

      const dirHandle = await window.showDirectoryPicker({
        id: "AULI_CATO",
        mode: "readwrite",
      });

      await set("directory", dirHandle);
      console.log("store dir handle:", dirHandle.name);
    } catch (error) {
      console.log("get directory error:", error);
    }
  };

  // -----------------------------------------------------------------

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
            return;
          }

          const writeFile = await directory.getFileHandle("gesture.cato", {
            create: true,
          });
          await set("gesture.cato", writeFile);
          console.log("stored file handle:", writeFile.name);
          // code for checking if gesture.cato file handle exists

          // const checkHandleOrUndefined = await get('checkGesture.cato');

          // if (checkHandleOrUndefined) {
          //   console.log("retrieved file handle:", checkHandleOrUndefined.name);
          //   return;
          // }

          // const checkGestureWrite = await directory.getFileHandle('checkGesture.cato', { create: false })
          // if(checkGestureWrite !== null) {
          //   await set('checkConfig', checkGestureWrite);
          //   console.log('stored config.cato handle: ', checkGestureWrite.name);
          // };
        }
      }
    } catch (error) {
      console.log("write config.cato error:", error);
    }
  };

  // -------------------------------------------------------------------------------

  const getGestDataAccess = async () => {
    try {
      const directory = await get("directory");
      console.log("retrieved dir handle:", directory);

      if (typeof directory !== "undefined") {
        const perm = await directory.requestPermission();

        if (perm === "granted") {
          const logHandleOrUndefined = await get("log.txt");

          if (logHandleOrUndefined) {
            console.log("retrieved file handle:", logHandleOrUndefined.name);
            return;
          }
          const logFile = await directory.getFileHandle("log.txt", {
            create: false,
          });

          await set("log.txt", logFile);
          console.log("stored file handle:", logFile.name);
        }
      }
    } catch (error) {
      console.log("get log.txt file handle error:", error);
    }
  };

  const checkAccessGranted = () => {};

  const HandleAccessUI = () => {
    const fileHandles = ["directory", "gesture.cato", "log.txt"];

    if (get("log.txt") === null) {
      return (
        <>
          <div className="px-4 py-5 sm:p-4">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              access your gesture data
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>allow access to </p>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={getGestDataAccess}
              className="inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Connect
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="px-4 py-5 sm:p-4">
            <div className="sm:flex sm:items-start sm:justify-between">
              <h3 className="text-sm font-semibold leading-6 text-blue-500">
                Gesture Data Access Granted
              </h3>
              <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center text-blue-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <div>
        <div className="border-b border-gray-200 pb-5">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Device Access
          </h3>
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Reset Connection
        </button>
      </div>
    </>
  );
};

export default DeviceAccess;