import { addDoc, collection, serverTimestamp } from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreGestData = (gesture, user, logFile) => {
  console.log(user);

  const sendDocRef = async() => {
    try {
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