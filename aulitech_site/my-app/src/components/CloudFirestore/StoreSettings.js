import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  query,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const StoreSettings = (devices, currIndex, newJson) => {
  const sendNewJson = async() => {
    try {
      const userRef = doc(db, "users", user.uid, "userCatos", devices[currIndex].id);

      await updateDoc(userRef, {
        configjson: newJson
      });
    } catch (err) {
      console.log("save user data err: ", err);
    }
  }

  return sendNewJson();
}

export default StoreSettings;