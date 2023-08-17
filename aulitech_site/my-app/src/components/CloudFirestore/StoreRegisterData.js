import { doc, setDoc, collection, addDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreRegisterData = ({user}) => {
console.log(user);
const sendDocRef = async() => {
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    uid: user.uid,
    firstname: 'First name',
    lastname: 'Last Name',
  })

  const colRef = collection(db, "users");
  await addDoc(collection(colRef, user.uid, 'userCatos'), {
    initialize: 'initializeUserCatosSubcollection'
  })

  }
    return sendDocRef();
  }
  
  export default StoreRegisterData;