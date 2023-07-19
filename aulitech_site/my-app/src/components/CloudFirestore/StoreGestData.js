import React, { addDoc, collection, serverTimestamp } from "firebase/firestore"; 
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const StoreGestData = ({gesture, user, logFile}) => {
  const navigate = useNavigate();
  const sendDocRef = async() => {
    try {
      await addDoc(collection(db, 'gesture-data'), {
        samples: logFile,
        timestamp: serverTimestamp(),
        gesture: gesture,
        useruid: user.uid
      }).then(() => {
        navigate('/')
      })
    }
    catch(error) {
      console.log("Gesture cloud firebase error: ", error);
    }
  }

  return sendDocRef();
};
export default StoreGestData;