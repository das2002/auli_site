import React, { useEffect, useState } from "react";
import SettingsNav from "./SettingsNav";
import FormatJson from "./FormatJson";
import { defaultConfig } from "./RegisterCatoDevice";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

import GetDeviceConfigs from "./GetDeviceConfigs";

const CatoSettings = ({ classNames, user }) => {
  const [firstDevice, setFirstDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  // const [gotDevices, setGotDevices] = useState(false);
  const [curr, setCurr] = useState(0);

  const handleCurr = (currConfig) => {
    setCurr(currConfig);
  };

  useEffect(() => {
    const queryUserCatos = async () => {  
      let docSnapData;

      try {
        const colRef = collection(db, "users");
        // const queryCol = query(collection(colRef, user.uid, 'userCatos'), where("initialize", "==", "initializeUserCatosSubcollection"));
        const queryCol = query(collection(colRef, user.uid, "userCatos"));
  
        const docSnap = await getDocs(queryCol);
        docSnap.forEach((doc) => {
          docSnapData = doc.data();
        });
    
        if (docSnapData === undefined) {
          setFirstDevice(true);
          console.log('first device: ', firstDevice);
          return;
        } else {
          setFirstDevice(false);
          console.log('first device: ', firstDevice);
          return;
        }
      } catch (error) {
        console.log("query userCatos collection error: ", error);
      }
    };

    return () => {
      queryUserCatos();
    }
  }, [])

  useEffect(() => {
    let configData = [];

    const getUserConfigs = async () => {

        try {
        const colRef = collection(db, "users");
        const queryCol = query(collection(colRef, user.uid, "userCatos"));

          const colSnap = await getDocs(queryCol);
          colSnap.forEach((doc) => {
            configData.push({
              id: doc.id,
              data: doc.data()
            });
            console.log(doc.data());
          });
          // setDevices(configData);
          // setGotDevices(true);
      } catch (error) {
        console.log("get user cato configs error: ", error);
      }
    }


    return () => {
      getUserConfigs();
      setDevices(configData);
    }

  }, []);

console.log('devices: ', devices);

  return (
    <>
      <SettingsNav classnames={classNames} devices={devices} handleCurr={handleCurr}/>
      <FormatJson firstDevice={firstDevice} devices={devices} curr={curr}/> 
    </>
  );
};

export default CatoSettings;
