import React, { useEffect, useState } from "react";
// import SettingsNav from "./SettingsNav";
import FormatJson from "../../junk/FormatJson";
// import { defaultConfig } from "./RegisterCatoDevice";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NavLink } from "react-router-dom";
import FlattenJson from "./FlattenJson";
import { useParams } from 'react-router-dom';


// import GetDeviceConfigs from "./GetDeviceConfigs";

const CatoSettings = ({ classNames, user, devices, currIndex }) => {
  // const [test, setTest] = useState(0);
  console.log("devices: ", devices);

  // const { cato } = useParams();
  // currIndex = cato;
  // console.log("thecaot", cato, devices[cato]);

  return (
    <div >
      <div className="sticky top-0 z-50 py-5 bg-white border-b border-gray-200">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Device Settings
          </h2>
          <p className="pt-2.5 text-base leading-6 text-gray-600">{devices[currIndex].data.devicename}</p>
        </div>
        
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
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
