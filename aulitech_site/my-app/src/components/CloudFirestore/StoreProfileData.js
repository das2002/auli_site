import { doc, updateDoc} from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreProfileData = (user, first, last) => {
  const handleSaveProfileInfo = async () => {
    try {
      /* get reference to user in the User DB */
      const userRef = doc(db, "users", user.uid);

      /* Update user's document with any changes made on the profile page */
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