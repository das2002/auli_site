import React, { useState } from "react";

const OperationMode = ({classNames, jsonData}) => {
  const [opMode, setOpMode] = useState();
  

  const editOpMode = (e) => {
    setOpMode(e.target.value);

    console.log(jsonData);
    return jsonData.operation_mode = e.target.value;
  }

  return (
    <>
      <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Operation Mode.</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            These are the avaliable operation modes for your Cato blah blah blah description.
          </p>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">Modes</legend>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="opModeZero"
                      name="opModeZero"
                      type="checkbox"
                      value={0}
                      onChange={editOpMode}
                      className={opMode === 0 ? "text-indigo-600 focus:ring-indigo-600 h-4 w-4 rounded border-gray-300" : "h-4 w-4 rounded border-gray-300"}
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="opModeZero" className="font-medium text-gray-900">
                      0
                    </label>
                    <p className="text-gray-500">Mode is used for something</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="opModeOne"
                      name="opModeOne"
                      type="checkbox"
                      value={1}
                      onChange={editOpMode}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="opModeOne" className="font-medium text-gray-900">
                      1
                    </label>
                    <p className="text-gray-500">Mode is used for something</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="opModeTwo"
                      name="opModeTwo"
                      type="checkbox"
                      value={2}
                      onChange={editOpMode}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="opModeTwo" className="font-medium text-gray-900">
                      2
                    </label>
                    <p className="text-gray-500">Mode is used for something.</p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      
    </>
  )
}

export default OperationMode;


// import { collection, doc, updateDoc, query} from "firebase/firestore";
// import { db } from "../../firebase";

// const OperationModeSet = (user, configDocId, opMode) => {
  
//   console.log(opMode);
//   console.log(user);
//   console.log(configDocId);

//   const updateOpMode = async() => {
//       try {
//         const userColRef = doc(db, "users", user.user.uid);
//         const catoColRef = collection(userColRef, "userCatos");
//         const catoDocRef = doc(catoColRef, configDocId);

//         const docQuery = query(catoDocRef);

//         await updateDoc(docQuery, {
//           operation_mode: opMode
//         });
//       }
//       catch(error) {
//         console.log("update operation mode error: ", error);
//       }
//   } 

//   return updateOpMode();
// };
// export default OperationModeSet;