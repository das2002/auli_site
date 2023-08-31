import { doc, updateDoc} from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreProfileData = (user, first, last) => {
  const handleSaveProfileInfo = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        firstname: first,
        lastname: last,
      });

    } catch (err) {
      console.log("save user data err: ", err);
    }
  };

  return handleSaveProfileInfo();
}

export default StoreProfileData;