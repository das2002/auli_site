import { doc, setDoc, collection, addDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreRegisterData = ({user}) => {

const sendDocRef = async() => {
  /* Create a user document in the Users DB*/
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    uid: user.uid,
    firstname: 'First name',
    lastname: 'Last Name',
  })

  /* Create a subcollection in the user document to hold all cato devices when registered later */
  const colRef = collection(db, "users");
  await addDoc(collection(colRef, user.uid, 'userCatos'), {
    initialize: 'initializeUserCatosSubcollection'
  })

  }
    return sendDocRef();
  }
  
  export default StoreRegisterData;