import React, { useState, useEffect } from "react";
import { clear } from 'idb-keyval';
import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "../../firebase";
import ConnectDirectory from "./device-connection/ConnectDirectory";
import WriteAccess from "./device-connection/WriteAccess";
import GestDataAccess from "./device-connection/GestDataAccess";
import { Link } from "react-router-dom";
import QueryUserGstrData from "./user-data-count/QueryUserGstrData";

export const styles = {ACTIVE_RING : "ring-1 ring-blue-500"}

const Dashboard = ({classNames, user}) => {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');

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

    const reset = () => {
      clear();
    }

  // const HandleHeaderContent = () => {
  //   if(userData === null) {
  //     return (
  //       <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
  //         Welcome Back!
  //       </h2>
  //     )
  //   } else {
  //     if(userData.firstname === 'First name') {
  //       return (
  //         <>
  //           <header className="shrink-0 bg-transparent">
  //             <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

  //               <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
  //                 Welcome Back!
  //               </h2>
  //               <div className="rounded-md bg-blue-50 p-2">
  //             <div className="flex">
  //               <div className="ml-3 flex-1 md:flex md:justify-between">
  //                 <p className="text-sm text-blue-500">Finish setting up your account.</p>
  //                 <p className="mt-3 text-sm md:ml-6 md:mt-0">
  //                   <Link to="/profile" className="whitespace-nowrap font-medium text-blue-500 hover:text-blue-600">
  //                     Account
  //                     <span aria-hidden="true"> &rarr;</span>
  //                   </Link>
  //                 </p>
  //               </div>
  //             </div>
  //           </div>   
  //             </div>
  //           </header> 
  //         </>
  //       )
  //     } else {
  //       return (
  //         <header className="shrink-0 bg-transparent">
  //             <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

  //               <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
  //                 Welcome Back {userData.firstname}!
  //               </h2>
  //             </div>
  //             </header>
  //       )
  //     }
  //   }
  // }

  const handleUserCanRecord = () => {

  };

  return (
    <div className="flex min-h-full flex-col">
                    <header className="shrink-0 bg-transparent">
              <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Cato Dashboard
                </h2>
              </div>
              </header>

      {/* column wrapper*/}
      <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2 h-full mt-5">
          {/* Left sidebar & main wrapper */}
          <div className="flex-1 xl:flex mr-5">
            <div className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
              {/* Left column area */}
            </div>
            <QueryUserGstrData user={user}/>
          </div>

          <div className="shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-72 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6">
            <div className="border-b border-gray-200 pb-5">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Device Access</h3>
            </div>
            <ConnectDirectory classNames={classNames}/>
            <WriteAccess classNames={classNames}/>
            <GestDataAccess classNames={classNames}/>
            <button
              type="button"
              onClick={reset}
              className="mt-10 inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Reset Connection
            </button>
          </div>
        </div>
      </div>
  )
}

export default Dashboard;