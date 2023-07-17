import React from "react";
import { clear } from "idb-keyval";
import ConnectDirectory from "./ConnectDirectory";
import GestDataAccess from "./GestDataAccess";
import WriteAccess from "./WriteAccess";


const DeviceAccess = ({classNames}) => {
  const reset = () => {
    clear();
  }

  return (
    <>
      <div>
        <div className="border-b border-gray-200 pb-5">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Device Access
          </h3>
        </div>
        <ConnectDirectory classNames={classNames} />
        <WriteAccess classNames={classNames} />
        <GestDataAccess classNames={classNames} />
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