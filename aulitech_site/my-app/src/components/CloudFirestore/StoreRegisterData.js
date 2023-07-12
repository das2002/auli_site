import { addDoc, collection, doc, setDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreRegisterData = ({user}) => {
  console.log(user);
  const sendDocRef = async() => {
    await addDoc(collection(db, 'users'), {
      email: user.email,
      uid: user.uid,
      username: 'Username',
      firstname: 'First name',
      lastname: 'Last Name'
    })
  }
  return sendDocRef();
}

export default StoreRegisterData;