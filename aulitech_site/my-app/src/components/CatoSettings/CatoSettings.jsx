import React, { useEffect, useState } from "react";
import FlattenJson from "./FlattenJson";
import StoreSettings from "../CloudFirestore/StoreSettings";
import WriteNewConfig from "./WriteNewConfig";
import { useParams } from "react-router-dom";

const CatoSettings = ({classNames, user, devices, currIndex}) => {
  console.log("devices: ", devices);

  // const { cato } = useParams();
  // currIndex = cato;
  // console.log("thecaot", cato, devices[cato]);

  /* When Save Changes button clicked save the changes DB and device */
  const handleSaveJsonChanges = () => {

    /* Send changes to current device jsondata to DB */
    StoreSettings(
      devices,
      user,
      currIndex,
      JSON.stringify(devices[currIndex].jsondata)
    );

    /* Send new config.json to Cato device */
    /* 
      NOTE -> Issue because if the Cato is not plugged in then config.json on device won't be updated.
      May need some kind of update cato settings button / walk through that lets users know they need to have it plugged in
    */
    WriteNewConfig(devices, currIndex);
  };

// --------------------------------------------------------------------------------------------------------------------------------------------------

  /* Retrieve the current device opened on accordian and display the devicename */
  const DisplayDevicename = () => {
    try {
      return (
          <p className="text-base leading-6 text-gray-600">
            {devices[currIndex].data.devicename !== undefined
              ? devices[currIndex].data.devicename
              : null}
          </p>
      );
    } catch (err) {
      console.log("display devicename err: ", err);
    }
  };

  /* Display title text and devicename underneath */
  const DisplayTitle = () => {
    return (
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight pb-2.5">
          Device Settings
        </h2>
        <DisplayDevicename />
      </div>
    );
  }

  /* Diaplay button to save changes */
  const DisplaySaveChangesBtn = () => {
    return (
      <div className="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          onClick={handleSaveJsonChanges}
          className="inline-flex rounded-full items-center bg-blue-500 px-2.5 py-1 text-lg font-semibold text-white disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-blue-300"
        >
          Save Changes
        </button>
      </div>
    );
  }

  /* Display the title, devicename, and save changes button in header section*/
  const DisplayHeader = () => {
    return (
      <div className="sticky top-0 z-50 py-5 bg-white border-b border-gray-200">
        <div className="md:flex md:items-center md:justify-between">
          <DisplayTitle/>
          <DisplaySaveChangesBtn/>
        </div>
      </div>
    )
  }

// --------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <div>
      <DisplayHeader />
      <FlattenJson classNames={classNames} devices={devices} curr={currIndex} />
    </div>
  );
};

export default CatoSettings;
