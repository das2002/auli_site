import React, {useState} from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const UserCatoDevices = (user, handleDevice) => {
  const queryUserCatos = async() => {
    let docSnapData;
    let docId;
    try{
      const colRef = collection(db, "users");
      const queryCol = query(collection(colRef, user.uid, 'userCatos'), where("initialize", "==", "initializeUserCatosSubcollection"));
      
      const docSnap = await getDocs(queryCol);
      docSnap.forEach((doc) => {
        docSnapData = doc.data();
        docId = doc.id;
      })

      if(docSnapData) {
        handleDevice(true, docId);
      } else {
        handleDevice(false, '');
      }
    }
    catch(error) {
      console.log("query userCatos collection error: ", error);
    }
  }
  return queryUserCatos();
}

export default UserCatoDevices