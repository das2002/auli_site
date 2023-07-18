import React, { useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  getDocs,
} from "firebase/firestore";

const GetDeviceConfigs = (user, handleDevices) => {
  const [docData, setDocData] = useState([]);

  const getCatoData = () => {
    const getUserConfigs = async () => {
      let configData = [];

      try {
        const colRef = collection(db, "users");
        const queryCol = query(collection(colRef, user.uid, 'userCatos'));

        const colSnap = await getDocs(queryCol);
        colSnap.forEach((doc) => {
          configData.push(
            {id: doc.id, name: doc.data().devicename, configfile: doc.data().configjson}
          );
          console.log(doc.data(), doc.id);

        })

        setDocData(configData);
      
      } catch (error) {
        console.log("get user cato configs error: ", error);
      }
    };
    getUserConfigs();
  };
  if (docData === []) {
    getCatoData();
  }
  return handleDevices(docData);
};

export default GetDeviceConfigs;