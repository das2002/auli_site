import { db } from "../../firebase";
import {
  updateDoc,
  doc,
} from "firebase/firestore";

const StoreSettings = (devices, user, currIndex, newJson) => {
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