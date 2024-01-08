import { doc, updateDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreProfileData = async (user, displayname = '', email = '') => {
  try {
    console.log(displayname, email)
    /* Get reference to user in the User DB */
    const userRef = doc(db, "users", user.uid);

    /* Initialize an object to hold the updates */
    let updates = {};

    /* Check if display name is provided and update the object */
    if (displayname) {
      updates.displayname = displayname;
    }

    /* Check if email is provided and update the object */
    if (email) {
      updates.email = email;
    }

    /* Update user's document with any changes made on the profile page */
    /* This will only update the fields that are provided */
    if (Object.keys(updates).length > 0) {
      await updateDoc(userRef, updates);
    }

  } catch (err) {
    console.log("save user data error: ", err);
    // Optionally, you might want to re-throw the error or handle it differently
  }
};

export default StoreProfileData;
