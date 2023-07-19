import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import SelectGesture from "../../junk/SelectGesture";
import DeviceAccess from "./DeviceAccess";
import ChooseGest from "./ChooseGest";

export default function RecordGstr({ classNames }) {
  // const [currStep, setCurrStep] = useState([
  //   <DeviceAccess classNames={classNames}/>
  // ])
  const [gestName, setGestName] = useState("");

  const handleGestName = (name) => {
    setGestName(name);
  };

  const handleNextStep = (currStep, doNext) => {};

  const DisplaySteps = () => {};

  return (

      <div className="flex min-h-full flex-col">
        <header className="shrink-0 bg-transparent">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Record Gestures
          </h2>
          </div>
        </header>
        <div>
        <div className="w-full border-b border-gray-200 px-4 py-4 ">
              <DeviceAccess classNames={classNames}/>
          </div>

        {/* 3 column wrapper */}
        <div className="mx-auto flex-row flex-wrap w-full max-w-7xl grow lg:flex xl:px-2">
          <div className="flex-1 xl:flex">

            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              {/* Main area */}
              <ChooseGest/>
              </div>
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              {/* Main area */}
              <ChooseGest/>
              </div>

          </div>
          <div className="w-full border-t border-gray-200 px-4 py-4 ">
          <div className="mt-2">
          <button
            type="button"
            className="inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Select Gesture
          </button>
        </div>
          </div>

          {/* <div className="shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-96 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6">
          </div> */}
        </div>

          </div>
      </div>



  );
}

// return (
//   <div className="flex min-h-full flex-col">
//     <header className="shrink-0 border-b border-gray-200 bg-white">
// <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
// <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
//   Record Gestures
// </h2>
// </div>
//     </header>

//     <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8 ">
//       <aside className="sticky top-8 hidden w-44 shrink-0 lg:block ">
//       <div className="shrink-0 border-gray-200 px-4 py-6 sm:px-6 lg:w-72 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6 mt-5 bg-white shadow sm:rounded-lg">

//       <div className="border-b border-gray-200 pb-5 ">
//             <h3 className="text-base font-semibold leading-6 text-gray-900">Device Access</h3>
//           </div>
//           <ConnectDirectory classNames={classNames}/>
//           <WriteAccess classNames={classNames}/>
//           <GestDataAccess classNames={classNames}/>
//           <button
//             type="button"
//             onClick={reset}
//             className="mt-10 inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//           >
//             Reset Connection
//           </button>
//           </div>
//       </aside>

//       <main className="flex-1">{/* Main area */}</main>

//       <aside className="sticky top-8 hidden w-96 shrink-0 xl:block">{/* Right column area */}</aside>
//     </div>
//   </div>
// )
