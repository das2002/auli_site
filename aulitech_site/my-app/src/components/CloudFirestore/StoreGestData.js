import React, { addDoc, collection, serverTimestamp } from "firebase/firestore"; 
import { db } from "../../firebase";
import { styles } from "../../junk/Configure";
import { useNavigate } from "react-router-dom";

const StoreGestData = ({classNames, gesture, logFile, activeStore}) => {
  const navigate = useNavigate();
  const sendDocRef = async() => {
    await addDoc(collection(db, 'gesture-data'), {
      samples: logFile,
      timestamp: serverTimestamp(),
      gesture: gesture,
    }).then(() => {
      navigate('/')
    })

  }

  return (
    <>
      <div className={classNames(activeStore ? styles.ACTIVE_RING : "", "bg-white shadow sm:rounded-lg sm:mx-auto sm:w-full md:max-w-md")}>
        <div className="px-4 py-5 sm:p-6">
        <div className="mt-5">
          <button
            type="button"
            disabled={logFile === [] ? true : false}
            onClick={sendDocRef}
            className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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