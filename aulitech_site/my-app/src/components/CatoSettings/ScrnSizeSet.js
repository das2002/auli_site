import { collection, doc, updateDoc, query} from "firebase/firestore";
import { db } from "../../firebase";

const ScrnSizeSet = (user, configDocId, scrnSizeA, scrnSizeB) => {

  console.log(scrnSizeA, scrnSizeB);
  console.log(user);
  console.log(configDocId);

  const updateScrnSize = async() => {
      try {
        const userColRef = doc(db, "users", user.user.uid);
        const catoColRef = collection(userColRef, "userCatos");
        const catoDocRef = doc(catoColRef, configDocId);

        const docQuery = query(catoDocRef);

        await updateDoc(docQuery, {
          screen_size: [
            scrnSizeA,
            scrnSizeB
          ]
        });
      }
      catch(error) {
        console.log("update operation mode error: ", error);
      }
  } 

  return updateScrnSize();
};
export default ScrnSizeSet;