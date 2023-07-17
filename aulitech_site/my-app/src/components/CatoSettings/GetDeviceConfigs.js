import React, { useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  getDocs,
} from "firebase/firestore";

const GetDeviceConfigs = (user) => {
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
        })

        setDocData(configData)

      } catch (error) {
        console.log("get user cato configs error: ", error);
      }
    };
    getUserConfigs();
  };

  getCatoData();
  return (docData);
};

export default GetDeviceConfigs;