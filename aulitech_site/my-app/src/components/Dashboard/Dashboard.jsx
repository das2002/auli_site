import React, { useState, useEffect } from "react";
import { clear } from "idb-keyval";
import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "../../firebase";

import { Link } from "react-router-dom";
import UserDevices from "./UserDevices";

export const styles = { ACTIVE_RING: "ring-1 ring-blue-500" };

export default function Dashboard({
  classNames,
  user,
  devices,
}) {

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex justify-between bg-transparent border-b border-gray-200">
      <div className="flex h-16 max-w-7xl justify-between items-center">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">
            Dashboard
          </h2>
        </div>
      </header>
      <UserDevices devices={devices} />

      {/* column wrapper
      <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2 h-full mt-5">
        <div className="flex-1 xl:flex mr-5">
          {devices.map((device) => (
            <div key={device.data.devicename}>
              <p>{device.data.devicename}</p>
              <p>
                {device.jsondata.operation_mode.value}
              </p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

// const [userData, setUserData] = useState(null);
// const [name, setName] = useState('');

//     const getUserData = async() => {
//       console.log('get user data');
//         try{
//           const userQuery = query(collection(db, "users"), where("email", "==", user.email))
//           const querySnapshot = await getDocs(userQuery);
//           do{
//             querySnapshot.forEach((doc) => {
//             setUserData(doc.data());
//             });
//           } while(userData === null);
//         }
//         catch(error) {
//           console.log("query user collection error:", error);
//         }
//     }

//     return () => {
//       getUserData();
//     }
//   }, [user.email, userData]);

// {/* column wrapper*/}
// <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2 h-full mt-5">
//     {/* Left sidebar & main wrapper */}
//     <div className="flex-1 xl:flex mr-5">
//       <div className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
//         {/* Left column area */}
//       </div>
//       <QueryUserGstrData user={user}/>
//     </div>

//     <div className="shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-72 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6">

//     </div>
//   </div>
