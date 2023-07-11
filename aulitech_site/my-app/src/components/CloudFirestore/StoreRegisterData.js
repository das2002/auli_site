import { addDoc, collection, serverTimestamp, doc, setDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreRegisterData = ({user}) => {
  console.log(user);
  const sendDocRef = async() => {
    await setDoc(doc(db, 'users', user.email), {
      email: user.email,
      uid: user.uid
    })
  }
  return sendDocRef();
}

export default StoreRegisterData;