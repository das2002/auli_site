import { addDoc, collection, serverTimestamp } from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreGestData = (gesture, user, logFile) => {

  const sendDocRef = async() => {
    try {
      /* Add document to the GestureData DB with log.txt data, user, and time info */
      await addDoc(collection(db, 'gesture-data'), {
        samples: logFile,
        timestamp: serverTimestamp(),
        gesture: gesture,
        useruid: user.uid
      })
    }
    catch(error) {
      console.log("Gesture cloud firebase error: ", error);
    }
  }

  return sendDocRef();
};
export default StoreGestData;