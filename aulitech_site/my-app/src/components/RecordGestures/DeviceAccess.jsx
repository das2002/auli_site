import React, { useState, useEffect } from "react";
import { clear, get, set } from "idb-keyval";
import { styles } from "../Dashboard/Dashboard";

const DeviceAccess = ({ classNames }) => {
  const [connected, setConnected] = useState(false);
  const [err, setErr] = useState("");

  // useEffect(() => {
  //   let isConnect;
  //   const checkAccessGranted = () => {
  //     const fileHandles = ["directory", "gesture.cato", "log.txt"];

  //     fileHandles.forEach((handle) => {
  //       if (get(handle) === null) {
  //         isConnect = false;
  //       } else {
  //         isConnect = true;
  //       }
  //     });
  //   };

  //   return () => {
  //     checkAccessGranted();
  //     setConnected(isConnect);
  //   }
  // }, [])

  // --------------------------------------------------------------------

  const getDirectory = async () => {
    try {
      const dirHandleOrUndefined = await get("directory");
      const writeHandleOrUndefined = await get("gesture.cato");
      const logHandleOrUndefined = await get("log.txt");

      if (dirHandleOrUndefined) {
        console.log("retrieved dir handle:", dirHandleOrUndefined.name);
      } else {
        const dirHandle = await window.showDirectoryPicker({
          id: "AULI_CATO",
          mode: "readwrite",
        });

        await set("directory", dirHandle);
        console.log("store dir handle:", dirHandle.name);

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        if (writeHandleOrUndefined) {
          console.log("retrieved file handle:", writeHandleOrUndefined.name);
        } else {
          const writeFile = await dirHandle.getFileHandle("gesture.cato", {
            create: true,
          });

          await set("gesture.cato", writeFile);
          console.log("stored file handle:", writeFile.name);
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        if (logHandleOrUndefined) {
          console.log("retrieved file handle:", logHandleOrUndefined.name);
          return;
        } else {
          const logFile = await dirHandle.getFileHandle("log.txt", {
            create: false,
          });

          await set("log.txt", logFile);
          console.log("stored file handle:", logFile.name);
        }
      }
    } catch (error) {
      console.log("get directory error:", error);
    }
  };

  // -----------------------------------------------------------------

  const getWriteAccess = async () => {
    try {
      const directory = await get("directory");

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
          return;
        }
      }
    } catch (error) {
      console.log("get log.txt file handle error:", error);
    }
  };

  // -----------------------------------------------------------------------------
  //  UI Functionality

  const getAccess = () => {
    const fileHandles = ["directory", "gesture.cato", "log.txt"];

    getDirectory();
    // getWriteAccess();
    // getGestDataAccess();

    fileHandles.forEach((handle) => {
      if (get(handle) === null) {
        setErr("There was an error connecting to Cato.");
      } else {
        setConnected(true);
      }
    });
  };

  const reset = async () => {
    clear();
    setConnected(false);
    const dirHandleOrUndefined = await get("directory");
    console.log("reset dir handle", dirHandleOrUndefined);

    const writeHandleOrUndefined = await get("gesture.cato");
    console.log("reset dir handle", writeHandleOrUndefined);

    const logHandleOrUndefined = await get("log.txt");
    console.log("reset dir handle", logHandleOrUndefined);
  };

  //--------------------------------------------------------------------
  //  UI Components

  const HandleConnectUI = () => {
    return (
      <>
        <div
          className={classNames(
            styles.ACTIVE_RING,
            "mt-5 bg-white shadow sm:rounded-lg"
          )}
        >
          <div className="px-4 py-5 sm:p-4">
            <div className="sm:flex sm:items-start sm:justify-between">
              <h3 className="text-sm font-semibold leading-6 text-blue-500">
                Connected to Cato
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
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          Reset
        </button>
      </>
    );
  };

  const HandleNoConnectUI = () => {
    return (
      <>
        <div className="sm:p-2">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Connect to Cato
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Click Connect, you will be prompted by your browser to allow
              access to Cato. Allow access to record gestures.
            </p>
          </div>
        </div>
        <div className="mt-2">
          <button
            type="button"
            onClick={getAccess}
            className="inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Connect
          </button>
        </div>
      </>
    );
  };

  return (
    <>
    <div className="border-b border-gray-200 pb-2">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Device Access
          </h3>
          {err === "" ? null : (
            <p className="mt-2 max-w-xl text-sm text-gray-500">{err}</p>
          )}
        </div>
        {connected ? <HandleConnectUI /> : <HandleNoConnectUI />}

    </>
  );
};

export default DeviceAccess;
