import React, {useState} from "react";
import { clear } from 'idb-keyval';
import ConnectDirectory from "../Dashboard/device-connection/ConnectDirectory";
import WriteAccess from "../Dashboard/device-connection/WriteAccess";
import GestDataAccess from "../Dashboard/device-connection/GestDataAccess";
import SelectGesture from "./SelectGesture";

export default function RecordGstr({classNames}) {
  const [gestName, setGestName] = useState('');

  const handleGestName = (name) => {
    setGestName(name);
  }

  const reset = () => {
    clear();
  }

  return (
    <div className="flex min-h-full flex-col">
        <header className="shrink-0 bg-transparent">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Record Gestures
              </h2>
          </div>
        </header>

        {/* 3 column wrapper */}
        <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
        
          {/* Left sidebar & main wrapper */}
          <div className="flex-1 xl:flex">
            <div className=" px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
              <SelectGesture classNames={classNames} handleGestName={handleGestName}/>

            </div>

            {/*<div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6"></div> */}
            
          </div>
        </div>
        </div>
  )

  // return (
  //   <div className="flex min-h-full flex-col">
  //     <header className="shrink-0 border-b border-gray-200 bg-white">
  //       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
  //       <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
  //         Record Gestures
  //       </h2>
  //       </div>
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
}
