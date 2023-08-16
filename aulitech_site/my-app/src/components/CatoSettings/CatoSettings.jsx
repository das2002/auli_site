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

  const { cato } = useParams();
  currIndex = cato;
  console.log("thecaot", cato, devices[cato]);


  // console.log("current config.json", devices[currIndex].jsondata);

  // useEffect(() => {
  //   const queryUserCatos = async () => {
  //     let docSnapData;

  //     try {
  //       const colRef = collection(db, "users");
  //       const queryCol = query(collection(colRef, user.uid, "userCatos"));

  //       const docSnap = await getDocs(queryCol);
  //       docSnap.forEach((doc) => {
  //         docSnapData = doc.data();
  //       });

  //       if (docSnapData === undefined) {
  //         setFirstDevice(true);
  //         return;
  //       } else {
  //         setFirstDevice(false);
  //         return;
  //       }
  //     } catch (error) {
  //       console.log("query userCatos collection error: ", error);
  //     }
  //   };

  //   return () => {
  //     queryUserCatos();
  //   }
  // }, [])

  // useEffect(() => {
  //   let configData = [];

  //   const getUserConfigs = async () => {

  //       try {
  //       const colRef = collection(db, "users");
  //       const queryCol = query(collection(colRef, user.uid, "userCatos"));

  //         const colSnap = await getDocs(queryCol);
  //         colSnap.forEach((doc) => {
  //           configData.push({
  //             id: doc.id,
  //             data: doc.data(),
  //             keysinfo: Object.keys(JSON.parse(doc.data().configjson)),
  //             valuesinfo: Object.values(JSON.parse(doc.data().configjson))
  //           });
  //         });
  //     } catch (error) {
  //       console.log("get user cato configs error: ", error);
  //     }
  //   }

  //   return () => {
  //     getUserConfigs();
  //     setDevices(configData);
  //   }
  // }, []);

  // console.log(devices[currIndex].data.devicename)
  return (
    <div className="flex min-h-full flex-col">
      <header className="shrink-0 bg-transparent">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Cato Settings
          </h2>
        </div>
      </header>
      {/* <FormatJson classNames={classNames} devices={devices} curr={currIndex}/> */}
      <FlattenJson classNames={classNames} devices={devices} curr={currIndex}/>
    </div>
  );
};

export default CatoSettings;
