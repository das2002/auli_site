import React, { useEffect, useState } from "react";
import FlattenJson from "./FlattenJson";
import StoreSettings from "../CloudFirestore/StoreSettings";

const CatoSettings = ({ classNames, user, devices, currIndex }) => {
  console.log("devices: ", devices);

  // const { cato } = useParams();
  // currIndex = cato;
  // console.log("thecaot", cato, devices[cato]);

  const handleSaveNewJson = () => {
    StoreSettings(
      devices,
      user,
      currIndex,
      JSON.stringify(devices[currIndex].jsondata)
    );
  };

  const DisplayDevicename = () => {
    try {
      return (
        <>
          <p className="pt-2.5 text-base leading-6 text-gray-600">
            {devices[currIndex].data.devicename !== undefined
              ? devices[currIndex].data.devicename
              : null}
          </p>
        </>
      );
    } catch (err) {
      console.log("display devicename err: ", err);
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-50 py-5 bg-white border-b border-gray-200">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Device Settings
            </h2>
            <DisplayDevicename/>
          </div>

          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              onClick={handleSaveNewJson}
              className="inline-flex rounded-full items-center bg-blue-500 px-2.5 py-1 text-lg font-semibold text-white disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-blue-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-full flex-col">
        <FlattenJson
          classNames={classNames}
          devices={devices}
          curr={currIndex}
        />
      </div>
    </div>
  );
};

export default CatoSettings;
