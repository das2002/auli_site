import { addDoc, collection, serverTimestamp, setDoc, doc, user} from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreProfileData = ({user, userName}) => {
  // const sendDocRef = async() => {
  //   await setDoc(doc(db, 'users', user.uid), {
  //     username: userName,

  //   })
  // }
}

export default StoreProfileData;