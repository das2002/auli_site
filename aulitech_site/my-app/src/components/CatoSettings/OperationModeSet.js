import { collection, doc, updateDoc, query} from "firebase/firestore";
import { db } from "../../firebase";

const OperationModeSet = (user, configDocId, opMode) => {
  
  console.log(opMode);
  console.log(user);
  console.log(configDocId);

  const updateOpMode = async() => {
      try {
        const userColRef = doc(db, "users", user.user.uid);
        const catoColRef = collection(userColRef, "userCatos");
        const catoDocRef = doc(catoColRef, configDocId);

        const docQuery = query(catoDocRef);

        await updateDoc(docQuery, {
          operation_mode: opMode
        });
      }
      catch(error) {
        console.log("update operation mode error: ", error);
      }
  } 

  return updateOpMode();
};
export default OperationModeSet;