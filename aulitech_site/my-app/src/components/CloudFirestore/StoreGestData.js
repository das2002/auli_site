import React, { addDoc, collection, serverTimestamp } from "firebase/firestore"; 
import { db } from "../../firebase";
import { styles } from "../../junk/Configure";
import { useNavigate } from "react-router-dom";

const StoreGestData = ({classNames, gesture, user, logFile, activeStore}) => {
  const navigate = useNavigate();
  const sendDocRef = async() => {
    try {
      await addDoc(collection(db, 'gesture-data'), {
        samples: logFile,
        timestamp: serverTimestamp(),
        gesture: gesture,
        useruid: user.uid
      }).then(() => {
        navigate('/')
      })
    }
    catch(error) {
      console.log("Gesture cloud firebase error: ", error);
    }
  }

  return (
    <>
      <div className={classNames(activeStore ? styles.ACTIVE_RING : "", "bg-white shadow sm:rounded-lg sm:mx-auto sm:w-full md:max-w-md")}>
        <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">6. Save Gesture</h3>
        <div className="mt-5">
          <button
            type="button"
            disabled={logFile === [] ? true : false}
            onClick={sendDocRef}
            className={classNames(activeStore ? "bg-blue-500 text-white" : "bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300", "rounded-full px-2.5 py-1 text-base font-semibold")}
          >
            Save
          </button>
        </div>
        </div>
      </div>
    </>
  )
};
export default StoreGestData;