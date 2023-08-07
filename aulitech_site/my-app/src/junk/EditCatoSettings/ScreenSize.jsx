import React, { useState } from "react";

const EditScreenSize = ({ jsonData }) => {
  const [scrnSizeA, setScrnSizeA] = useState("");
  const [scrnSizeB, setScrnSizeB] = useState("");

  const handleEditScreenSizeA = (e) => {
    setScrnSizeA(e.target.value);
    return (jsonData.screen_size[0] = e.target.value * 1);
  };

  const handleEditScreenSizeB = (e) => {
    setScrnSizeB(e.target.value);
    return (jsonData.screen_size[1] = e.target.value * 1);
  };

  return (
    <>
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Screen Size
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Adjust screen size blah blah balh some description.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="sizeA"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              (whatever value means)
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="sizeA"
                id="sizeA"
                value={scrnSizeA}
                onChange={handleEditScreenSizeA}
                className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder={jsonData ? jsonData.screen_size[0] : null}
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="sizeB"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              (whatever value means)
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="sizeB"
                id="sizeB"
                value={scrnSizeB}
                onChange={handleEditScreenSizeB}
                className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder={jsonData ? jsonData.screen_size[1] : null}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditScreenSize;

// import { collection, doc, updateDoc, query} from "firebase/firestore";
// import { db } from "../../firebase";

// const ScrnSizeSet = (user, configDocId, scrnSizeA, scrnSizeB) => {

//   console.log(scrnSizeA, scrnSizeB);
//   console.log(user);
//   console.log(configDocId);

//   const updateScrnSize = async() => {
//       try {
//         const userColRef = doc(db, "users", user.user.uid);
//         const catoColRef = collection(userColRef, "userCatos");
//         const catoDocRef = doc(catoColRef, configDocId);

//         const docQuery = query(catoDocRef);

//         await updateDoc(docQuery, {
//           screen_size: [
//             scrnSizeA,
//             scrnSizeB
//           ]
//         });
//       }
//       catch(error) {
//         console.log("update operation mode error: ", error);
//       }
//   }

//   return updateScrnSize();
// };
// export default ScrnSizeSet;
