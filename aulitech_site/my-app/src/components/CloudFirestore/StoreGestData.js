import { addDoc, collection, serverTimestamp } from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreGestData = (gesture, user, csvData) => {

  const sendDocRef = async() => {
    try {
      await addDoc(collection(db, 'gesture-data'), {
        
        csvContent: csvData,
        timestamp: serverTimestamp(),
        gestureName: gesture,
        userId: user.uid
      });
    }
    catch(error) {
      console.error("Gesture cloud firebase error: ", error);
    }
  };

  return sendDocRef();
};

export default StoreGestData;
